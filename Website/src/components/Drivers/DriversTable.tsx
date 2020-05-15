import React, { FC } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import androidIcon from '../../assets/img/ic_android.svg'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButton } from '../Common/StyledTableComponents/StyledButtons'

import { DriverType } from '../../types/drivers'


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
	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButton variant="outlined" onClick={()=>{ console.log('OPENING ADD DRIVER MODAL') }}>Add driver</StyledDefaultButton>
			</Toolbar>

			<CustomTable>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells Component={CustomTableCell} labels={labels} />
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (

						(row.userName.includes(searchText) ||
							row.firstName.includes(searchText) ||
							row.lastName.includes(searchText) ||
							row.phone.includes(searchText)) &&

						<TableRow key={row.id}>
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
				page={page}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	)
}

export default DriversTable;
