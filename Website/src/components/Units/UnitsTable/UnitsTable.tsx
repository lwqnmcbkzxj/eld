import React, { FC, useState } from 'react'
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Toolbar, FormControlLabel, makeStyles } from '@material-ui/core'
import { Paper, Checkbox } from '@material-ui/core'

import StatusLabel from '../../Common/StatusLabel/StatusLabel'
import shareIcon from '../../../assets/img/ic_share.svg'

import { useTableStyles } from './UntisTableStyle.js'
import { EnhancedTableHeadProps, EnhancedTableProps } from './UnitsTableTypes'
import EnhancedTableToolbar from './UnitsTableToolbar'

import { CustomTable, CustomPaginator, StyledTableCell, CustomTableHeaderCells } from '../../Common/StyledTableComponents/StyledTableComponents'
import { isContainsSearchText } from '../../../utils/isContainsSearchText'

type Order = 'asc' | 'desc';
const EnhancedTableHead: FC<EnhancedTableHeadProps> = ({ onSelectAllClick, numSelected, rowCount, ...props }) => {
	let labels = [
		{ label: 'Name', name: '' },
		{ label: 'Truck No.', name: '', },
		{ label: 'Last Location', name: '', },
		{ label: 'Share', name: '', },
		{ label: 'Date & Time', name: '', },
		{ label: 'Status', name: '', },
		{ label: 'Description', name: '', },
		{ label: 'Current SPD', name: '', align: 'right' }
	]
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].label);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	return (
		<TableHead>
			<TableRow>
				<StyledTableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						color="primary"
					/>
				</StyledTableCell>

				<CustomTableHeaderCells					
					labels={labels}
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
				/>
			</TableRow>
		</TableHead>
	);
}

const EnhancedTable: FC<EnhancedTableProps> = ({ rows, getUnits, ...props }) => {
	const classes = useTableStyles()
	const [selected, setSelected] = React.useState<string[]>([])
	// const [page, setPage] = React.useState(0)
	// const [rowsPerPage, setRowsPerPage] = React.useState(2)
	const [searchText, setSearchText] = useState("")

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((row) => row.id.toString())
			setSelected(newSelecteds)
			return;
		}
		setSelected([])
	};

	const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [] as string[]

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected)
	};

	// const handleChangePage = (event: unknown, newPage: number) => {
	// 	setPage(newPage)
	// };

	// const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	setRowsPerPage(parseInt(event.target.value, 10))
	// 	setPage(0)
	// };


	const getLocaleSpeed = (value: number) => {
		let valueWithComma = (value).toFixed(1)
		return valueWithComma.padStart(4, "0") + ' mph'
	}


	const isSelected = (id: string) => selected.indexOf(id) !== -1;

	const deleteItem = (id: number) => {
		console.log(id)
	}

	return (

		<div className={classes.root}>
			<Paper>
				<EnhancedTableToolbar
					numSelected={selected.length}
					selected={selected}
					deleteItem={deleteItem}
					searchText={searchText}
					setSearchText={setSearchText}

					getUnits={getUnits}
				/>

				<CustomTable>
					<EnhancedTableHead
						numSelected={selected.length}
						onSelectAllClick={handleSelectAllClick}
						rowCount={rows.length}
					/>
					<TableBody>
						{rows
							// .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => {

							const isItemSelected = isSelected(row.id.toString());
							if (isContainsSearchText(searchText, row, ['name', 'truckNumber'])) {
								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.id.toString())}
										tabIndex={-1}
										key={row.id}
									>
										<StyledTableCell padding="checkbox">
											<Checkbox checked={isItemSelected} color="primary" />
										</StyledTableCell>

										<StyledTableCell>{row.name}</StyledTableCell>
										<StyledTableCell>{row.truckNumber}</StyledTableCell>
										<StyledTableCell>{row.lastLocation}</StyledTableCell>
										<StyledTableCell>
											<button> <img src={shareIcon} alt="share" onClick={(e) => { console.log('share'); e.stopPropagation() }} /> </button>
										</StyledTableCell>
										<StyledTableCell>{row.date}</StyledTableCell>
										<StyledTableCell>
											{/* <StatusLabel text={row.status.text} theme={row.status.type} /> */}
										</StyledTableCell>
										<StyledTableCell style={{}}><div className="text-block">{row.description}</div></StyledTableCell>
										<StyledTableCell align="right">{getLocaleSpeed(row.currentSPD)}</StyledTableCell>


									</TableRow>
								);
							}

						})}
					</TableBody>
				</CustomTable>
				
				{/* <CustomPaginator
					length={rows.length}
					rowsPerPage={rowsPerPage}
					currentPage={page}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>  */}
			</Paper>
		</div>

	);
}


export default EnhancedTable