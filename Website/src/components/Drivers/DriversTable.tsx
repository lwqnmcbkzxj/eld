import React, { FC, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'

import { LabelType, AppStateType, StatusEnum } from '../../types/types'
import { DriverType } from '../../types/drivers'
import { UserType } from '../../types/user'

import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, IconButton } from '@material-ui/core';
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'
import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'
import StatusLabel from '../Common/StatusLabel/StatusLabel'

import DriversModal from '../Common/Modals/PagesModals/DriversModal'
import Loader from '../Common/Loader/Loader';

import androidIcon from '../../assets/img/ic_android.svg'
import editIcon from '../../assets/img/ic_edit.svg'
import refreshIcon from '../../assets/img/ic_refresh.svg'

import { isContainsSearchText } from '../../utils/isContainsSearchText'
import { getComparator, stableSort } from '../../utils/tableFilters'
import { isFetchingArrContains } from '../../utils/isFetchingArrayContains';
import { getDriverFromServer } from '../../redux/drivers-reducer'

type PropsType = {
	rows: Array<DriverType>
	getDrivers: () => void

	handleAdd: (driverObj: UserType) => void
	handleEdit: (driverObj: UserType) => void
}

const CustomTableCell = withStyles((theme) => ({
	body: {
		"&.app-version": {
			display: 'flex',
			alignItems: 'center',
			// justifyContent: 'space-around',
			"& .anroidSvgIcon.success": {
				marginRight: '8px',
				"&.success": {
					filter: 'invert(56%) sepia(65%) saturate(1474%) hue-rotate(40deg) brightness(97%) contrast(98%)',
				},
				"&.error": {
					filter: 'invert(27%) sepia(85%) saturate(2237%) hue-rotate(350deg) brightness(93%) contrast(92%)',
				},
			},
			
		},
	},
}))(StyledTableCell);

type Order = 'asc' | 'desc';
interface RouterProps extends RouteComponentProps<any> { }

const DriversTable: FC<PropsType & RouterProps> = ({ rows, getDrivers, handleAdd, handleEdit, ...props }) => {
	const dispatch = useDispatch()
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)
	const driver = useSelector<AppStateType, UserType>(state => state.drivers.currentDriver)

	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const [searchText, setSearchText] = React.useState("")

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	};

	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};
	const [addModalOpen, setAddModalOpen] = useState(false)
	const handleAddModalClose = () => {
		setAddModalOpen(false);
	};

	let labels = [
		{ label: "First Name", name: 'user_first_name' },
		{ label: "Last Name", name: 'user_last_name' },
		{ label: "Username", name: 'user_login' },
		{ label: "Phone No.", name: 'user_phone' },
		{ label: "Truck No.", name: 'vehicle_truck_number' },
		{ label: "Notes", name: 'user_notes' },
		{ label: "App Version", name: 'app_version' },
		{ label: "Device Version", name: 'device_version' },
		{ label: "Status", name: 'user_status', notSortable: true },
		{ label: "", name: '', notSortable: true },
	] as Array<LabelType>

	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	const [hoverId, setHoverId] = useState(-1)

	const editButtonRef = React.createRef<HTMLDivElement>()
	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<div>
					<StyledDefaultButtonSmall variant="outlined" onClick={() => { setAddModalOpen(true) }}>Add driver</StyledDefaultButtonSmall>
					<IconButton onClick={() => { getDrivers() }}><img src={refreshIcon} alt="referesh-icon" /></IconButton>
				</div>

			</Toolbar>

			<CustomTable subtractHeight={52}>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells
							Component={CustomTableCell}
							labels={labels}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
					</TableRow>
				</TableHead>
				<TableBody>

					{!isFetchingArrContains(isFetchingArray, ['drivers']) &&
						
						stableSort(rows as any, getComparator(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
							
							isContainsSearchText(searchText, row, [
								'user_first_name',
							'user_last_name',
							'user_login',
							'user_phone',
							'vehicle_truck_number',
							'user_notes',
							'app_version',
							'device_version',
							'user_status',]) &&
							<TableRow
								key={row.user_id}
								hover
								onDoubleClick={(e: any) => {
									if (editButtonRef.current && !editButtonRef.current.contains(e.target)) {
										props.history.push(`/drivers/${row.user_id}`)
									}
								}}
								onMouseEnter={() => { setHoverId(+row.user_id) }}
								onMouseLeave={() => { setHoverId(-1) }}
							>
								<CustomTableCell>{row.user_first_name}</CustomTableCell>
								<CustomTableCell>{row.user_last_name}</CustomTableCell>
								<CustomTableCell>{row.user_login}</CustomTableCell>
								<CustomTableCell>{row.user_phone}</CustomTableCell>
								<CustomTableCell>{row.vehicle_truck_number}</CustomTableCell>
								<CustomTableCell><div className="text-block">{row.user_notes}</div></CustomTableCell>
								<CustomTableCell className="app-version">
									<img src={androidIcon} alt="" className={`anroidSvgIcon success`} />
									<p>{row.app_version}</p>
								</CustomTableCell>
								<CustomTableCell>{row.device_version}</CustomTableCell>
								<CustomTableCell><StatusLabel text={row.user_status as StatusEnum} /></CustomTableCell>
								<StyledTableCell style={{ minWidth: '70px', boxSizing: 'border-box', paddingTop: '10px', paddingBottom: '10px' }}>
									{hoverId === row.user_id &&
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} ref={editButtonRef}>
											<button style={{ height: '32px' }}
												onClick={(e) => {
													setEditModalOpen(true);
													dispatch(getDriverFromServer(+row.user_id))
													e.preventDefault()
												}} >
												<img src={editIcon} alt="edit-icon" />
											</button>
										</div>
									}
								</StyledTableCell>
							</TableRow>

						))}
				</TableBody>
			</CustomTable>
			
			{isFetchingArrContains(isFetchingArray, ['drivers']) && <Loader />}

			<CustomPaginator
				length={rows.length}
				rowsPerPage={rowsPerPage}
				currentPage={page}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>

			{/* Edit modal */}
			{editModalOpen &&
				<DriversModal
				open={editModalOpen}
				handleClose={handleEditModalClose}
				initialValues={driver}
				titleText={"Edit Driver"}
				submitFunction={handleEdit}
				/>}

			{/* Add modal */}
			{addModalOpen &&
				<DriversModal
					open={addModalOpen}
					handleClose={handleAddModalClose}
					initialValues={{} as UserType}
					titleText={"Add Driver"}
					submitFunction={handleAdd}
				
				/>}


		</Paper>
	)
}

export default withRouter(DriversTable);
