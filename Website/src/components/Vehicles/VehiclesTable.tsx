import React, { FC } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { VehicleType } from '../../types/vehicles'

import { isContainsSearchText } from '../../utils/isContainsSearchText'

type PropsType = {
	rows: Array<VehicleType>
}

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
		{ label: "Truck No." },
		{ label: "Make" },
		{ label: "Model" },
		{ label: "License Plate No." },
		{ label: "ELD No." },
		{ label: "Notes" },
		{ label: "Status" },
	]
	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={()=>{ console.log('OPENING ADD VEHICLE MODAL') }}>Add vehicle</StyledDefaultButtonSmall>
			</Toolbar>

			<CustomTable subtractHeight={52}>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells labels={labels} />
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
						isContainsSearchText(searchText, row, ['make', 'model', 'license', 'eldNumber']) &&	

						<TableRow key={row.id}>
							<StyledTableCell>{row.truckNumber}</StyledTableCell>
							<StyledTableCell>{row.make}</StyledTableCell>
							<StyledTableCell>{row.model}</StyledTableCell>
							<StyledTableCell>{row.license}</StyledTableCell>
							<StyledTableCell>{row.eldNumber}</StyledTableCell>
							<StyledTableCell><div className="text-block" style={{ minWidth: '200px', maxWidth: '300px' }} >{row.notes}</div></StyledTableCell>
							<StyledTableCell><StatusLabel text={row.status.text} theme={row.status.type} /></StyledTableCell>
							
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
		</Paper>
	)
}

export default DriversTable;
