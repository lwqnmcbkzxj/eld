import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, IconButton } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import androidIcon from '../../assets/img/ic_android.svg'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'
import { withRouter, RouteComponentProps } from 'react-router'
import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { DriverType } from '../../types/drivers'
import { Link } from 'react-router-dom'
import DriversModal from '../Common/Modals/PagesModals/DriversModal'
import { isContainsSearchText } from '../../utils/isContainsSearchText'
import { getComparator, stableSort } from '../../utils/tableFilters'

import editIcon from '../../assets/img/ic_edit.svg'
import refreshIcon from '../../assets/img/ic_refresh.svg'
import { LabelType } from '../../types/types';
 
type PropsType = {
	rows: Array<DriverType>
}

const CustomTableCell = withStyles((theme) => ({
	body: {
		"&.app-version": {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-around',
			"& .anroidSvgIcon.success": {
				filter: 'invert(56%) sepia(65%) saturate(1474%) hue-rotate(40deg) brightness(97%) contrast(98%)',
			},
			"& .anroidSvgIcon.error": {
				filter: 'invert(27%) sepia(85%) saturate(2237%) hue-rotate(350deg) brightness(93%) contrast(92%)',
			},
		},
	},
}))(StyledTableCell);

type Order = 'asc' | 'desc';



interface RouterProps extends RouteComponentProps<any> {}

const DriversTable: FC<PropsType & RouterProps> = ({ rows, ...props }) => {
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

	


	let currentModalDataObj = {
		id: 1,
		first_name: "John",
		last_name: "Malkovich",
		user_name: 'malkovich',
		password: '12345678',
		email: 'malkovich@mail.ru',
		phone: '+1 (302) 894-6596',
		licence_number: '1586-986-78-562-3',
		state: 'Illinois',
		truck_number: '046',
		trailer_number: '569412',
		personal_conveyance: false,
		yard_move: false,
		eld: false,
		allow_manual_drive_time: false,
		co_driver: 'Donald Duck',
		home_terminal_address: '2400 Hassel Road, #400 Hoffman Estates, IL 60169',
		home_termial_timezone: 'Central Standart Time',
		notes: ''
	}

	const [currentModalData, setCurrentModalData] = useState(currentModalDataObj);
	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};
	const [addModalOpen, setAddModalOpen] = useState(false)
	const handleAddModalClose = () => {
		setAddModalOpen(false);
	};

	let labels = [
		{ label: "First Name", name: 'firstName' },
		{ label: "Last Name", name: 'lastName' },
		{ label: "Username", name: 'userName' },
		{ label: "Phone No.", name: 'phone' },
		{ label: "Truck No.", name: 'truckNumber' },
		{ label: "Notes", name: 'notes' },
		{ label: "App Version", name: 'appVersionStatus' },
		{ label: "Device Version", name: 'deviceVersion' },
		{ label: "Status", name: 'status', notSortable: true },
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
					<StyledDefaultButtonSmall variant="outlined" onClick={() => { setEditModalOpen(true) }}>Add driver</StyledDefaultButtonSmall>
					<IconButton><img src={refreshIcon} alt="referesh-icon" /></IconButton>
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

				{stableSort(rows as any, getComparator(order, orderBy))
					.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
					
					isContainsSearchText(searchText, row, ['userName', 'firstName', 'lastName', 'phone']) && 
						<TableRow
							key={row.id}
							hover
							onDoubleClick={(e: any) => {
								setEditModalOpen(true)
								// setCurrentModalData(row)
								e.preventDefault()
							}}
							onMouseEnter={() => { setHoverId(+row.id) }}
							onMouseLeave={() => { setHoverId(-1) }}
							onClick={(e: any) => { 
								if (editButtonRef.current && !editButtonRef.current.contains(e.target)) {
									props.history.push(`/drivers/${row.id}`)
								}
							 }}
						>
								<CustomTableCell>{row.firstName}</CustomTableCell>
								<CustomTableCell>{row.lastName}</CustomTableCell>
								<CustomTableCell>{row.userName}</CustomTableCell>
								<CustomTableCell>{row.phone}</CustomTableCell>
								<CustomTableCell>{row.truckNumber}</CustomTableCell>
								<CustomTableCell><div className="text-block">{row.notes}</div></CustomTableCell>
								<CustomTableCell className="app-version">
									<img src={androidIcon} alt="" className={`anroidSvgIcon ${row.appVersionStatus}`} />
									<p>{row.appVersion}</p>
								</CustomTableCell>
								<CustomTableCell>{row.deviceVersion}</CustomTableCell>
								<CustomTableCell>
									<StatusLabel text={"Status"}/>
							</CustomTableCell>
							<StyledTableCell style={{ minWidth: '70px', boxSizing: 'border-box', paddingTop: '10px', paddingBottom: '10px' }}>
								{hoverId === row.id &&
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} ref={editButtonRef}>
										<button style={{ height: '32px' }}
											onClick={(e) => {
												setEditModalOpen(true);
												// setCurrentModalData(row)
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
					initialValues={currentModalData}
					titleText={"Edit Driver"}
				/>}

			{/* Add modal */}
			{addModalOpen &&
				<DriversModal
					open={addModalOpen}
					handleClose={handleAddModalClose}
					initialValues={{}}
					titleText={"Add Driver"}
				/>}


		</Paper>
	)
}

export default withRouter(DriversTable);
