import React, { FC, useState, useEffect } from 'react'
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Toolbar, FormControlLabel, makeStyles } from '@material-ui/core'
import { Paper, Checkbox } from '@material-ui/core'
import { LabelType } from '../../../types/types'
import StatusLabel from '../../Common/StatusLabel/StatusLabel'
import shareIcon from '../../../assets/img/ic_share.svg'

import { useTableStyles } from './UntisTableStyle.js'
import { EnhancedTableHeadProps, EnhancedTableProps } from './UnitsTableTypes'
import EnhancedTableToolbar from './UnitsTableToolbar'

import { CustomTable, CustomPaginator, StyledTableCell, StyledTableRow, CustomTableHeaderCells } from '../../Common/StyledTableComponents/StyledTableComponents'
import { isContainsSearchText } from '../../../utils/isContainsSearchText'
import { getComparator, stableSort } from '../../../utils/tableFilters'
import { withRouter, RouteComponentProps } from 'react-router-dom'


type Order = 'asc' | 'desc';
const EnhancedTableHead: FC<EnhancedTableHeadProps> = ({ onSelectAllClick, numSelected, rowCount, labels, order, orderBy, onRequestSort, ...props }) => {

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
					onRequestSort={onRequestSort}
				/>
			</TableRow>
		</TableHead>
	);
}


interface RouterProps extends RouteComponentProps<any> { }
const EnhancedTable: FC<EnhancedTableProps & RouterProps> = ({ rows, getUnits, toggleTable, tableVisible, ...props }) => {
	const classes = useTableStyles()
	const [selected, setSelected] = React.useState<string[]>([])

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

	const getLocaleSpeed = (value: number) => {
		let valueWithComma = (value).toFixed(1)
		return valueWithComma.padStart(4, "0") + ' mph'
	}


	const isSelected = (id: string) => selected.indexOf(id) !== -1;

	const deleteItem = (id: number) => {
		console.log(id)
	}

	let labels = [
		{ label: 'Name', name: 'name' },
		{ label: 'Truck No.', name: 'truckNumber', },
		{ label: 'Last Location', name: 'lastLocation', },
		{ label: 'Share', name: '', },
		{ label: 'Date & Time', name: 'date', },
		{ label: 'Status', name: '', },
		{ label: 'Description', name: 'description', },
		{ label: 'Current SPD', name: 'currentSPD', align: 'right' }
	] as Array<LabelType>

	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

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

					toggleTable={toggleTable}
					tableVisible={tableVisible}
				/>

				<CustomTable subtractHeight={420} display={tableVisible && 'none'}>
					<EnhancedTableHead
						numSelected={selected.length}
						onSelectAllClick={handleSelectAllClick}
						rowCount={rows.length}
						labels={labels}
						order={order}
						orderBy={orderBy}
						onRequestSort={handleRequestSort}
					/>
					<TableBody>
						{stableSort(rows as any, getComparator(order, orderBy))
							.map((row, index) => {
								const isItemSelected = isSelected(row.id.toString());
								if (isContainsSearchText(searchText, row, ['name', 'truckNumber', 'lastLocation', 'date', 'description', 'currentSPD'])) {
									return (
										<StyledTableRow
											hover
											onClick={(event) => handleClick(event, row.id.toString())}
											tabIndex={-1}
											key={row.id}
											selected={isItemSelected}
										>
											<StyledTableCell padding="checkbox">
												<Checkbox checked={isItemSelected} color="primary" />
											</StyledTableCell>

											<StyledTableCell onDoubleClick={() => { props.history.push(`/drivers/${row.id}`) }}>{row.name}</StyledTableCell>
											<StyledTableCell>{row.truckNumber}</StyledTableCell>
											<StyledTableCell>{row.lastLocation}</StyledTableCell>
											<StyledTableCell>
												<button> <img src={shareIcon} alt="share" onClick={(e) => { console.log('share'); e.stopPropagation() }} /> </button>
											</StyledTableCell>
											<StyledTableCell>{row.date}</StyledTableCell>
											<StyledTableCell>
												<StatusLabel text={"Status"} />
											</StyledTableCell>
											<StyledTableCell style={{}}><div className="text-block">{row.description}</div></StyledTableCell>
											<StyledTableCell align="right">{getLocaleSpeed(+row.currentSPD)}</StyledTableCell>
										</StyledTableRow>
									);
								}
							})}
					</TableBody>
				</CustomTable>
			</Paper>
		</div>

	);
}


export default withRouter(EnhancedTable)