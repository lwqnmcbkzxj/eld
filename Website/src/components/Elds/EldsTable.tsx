import React, { FC } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButton } from '../Common/StyledTableComponents/StyledButtons'

import { EldType } from '../../types/elds'

import { isContainsSearchText } from '../../utils/isContainsSearchText'

type PropsType = {
	rows: Array<EldType>
}

const EldsTable: FC<PropsType> = ({ rows, ...props }) => {
	// const [page, setPage] = React.useState(0)
	// const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const [searchText, setSearchText] = React.useState("")

	// const handleChangePage = (event: unknown, newPage: number) => {
	// 	setPage(newPage)
	// };

	// const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setRowsPerPage(parseInt(event.target.value, 10))
	// 	setPage(0)
	// };

	let labels = [
		{ label: "ELD No." },
		{ label: "Notes" },
	]
	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButton variant="outlined" onClick={()=>{ console.log('OPENING ADD ELD MODAL') }}>Add ELD</StyledDefaultButton>
			</Toolbar>

			<CustomTable>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells labels={labels} />
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						isContainsSearchText(searchText, row, ['eldNumber']) &&	
						<TableRow key={row.id}>
							<StyledTableCell style={{ width: '200px' }}><div className="text-block" style={{ maxWidth: '200px' }} >{row.eldNumber}</div></StyledTableCell>
							<StyledTableCell><div className="text-block" style={{ minWidth: '200px' }} >{row.notes}</div></StyledTableCell>
						</TableRow>
					))}
				</TableBody>
			</CustomTable>

			{/* <CustomPaginator
				length={rows.length}
				rowsPerPage={rowsPerPage}
				currentPage={page}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/> */}
		</Paper>
	)
}

export default EldsTable;
