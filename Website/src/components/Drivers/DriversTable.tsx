import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import androidIcon from '../../assets/img/ic_android.svg'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { DriverType } from '../../types/drivers'

import DriversModal from '../Common/Modals/PagesModals/DriversModal'

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

const DriversTable: FC<PropsType> = ({ rows, ...props }) => {
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

	const [driverEditModalOpen, setDriverEditModalOpen] = useState(false)
	const handleDriverEditModalClose = () => {
		setDriverEditModalOpen(false);
	};


	let currentModalData = {
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

	const [currentDriverData, setCurrentDriverData] = useState(currentModalData);

	const [driverAddModalOpen, setDriverAddModalOpen] = useState(false)
	const handleDriverAddModalClose = () => {
		setDriverAddModalOpen(false);
	};


	




	let labels = [
		{ label: "First Name" },
		{ label: "Last Name" },
		{ label: "Username" },
		{ label: "Phone No." },
		{ label: "Truck No." },
		{ label: "Notes" },
		{ label: "App Version" },
		{ label: "Device Version" },
		{ label: "Status" }
	]
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].label);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={() => { setDriverAddModalOpen(true) }}>Add driver</StyledDefaultButtonSmall>
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
					{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (

						(row.userName.includes(searchText) ||
							row.firstName.includes(searchText) ||
							row.lastName.includes(searchText) ||
							row.phone.includes(searchText)) &&

						<TableRow
							key={row.id}
							hover
							onClick={() => {
							setDriverEditModalOpen(true)
							// setCurrentDriverData(row)
						}}>
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
								<StatusLabel text={row.status.text} theme={row.status.type} />
							</CustomTableCell>
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
			{driverEditModalOpen &&
				<DriversModal
					open={driverEditModalOpen}
					handleClose={handleDriverEditModalClose}
					initialValues={currentDriverData}
					titleText={"Edit Driver"}
				/>}

			{/* Add modal */}
			{driverAddModalOpen &&
				<DriversModal
					open={driverAddModalOpen}
					handleClose={handleDriverAddModalClose}
					initialValues={{}}
					titleText={"Add Driver"}
				/>}


		</Paper>
	)
}

export default DriversTable;
