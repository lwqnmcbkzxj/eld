import React, { FC, useState, useEffect } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button, Checkbox } from '@material-ui/core';
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'
import { withRouter, RouteComponentProps } from 'react-router'
import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'
import { LogsType } from '../../types/logs'
import { LabelType } from '../../types/types'

import iconDone from '../../assets/img/mark_done.svg'
import iconNone from '../../assets/img/mark_none.svg'
import iconAlert from '../../assets/img/mark_error.svg'

import { isContainsSearchText } from '../../utils/isContainsSearchText'
import { getComparator, stableSort } from '../../utils/tableFilters'

type PropsType = {
	labels: Array<LabelType>
	rows: Array<any>
	// rows: Array<LogsType>
}
type Order = 'asc' | 'desc';


const checkField = (label: LabelType, rowItem: string) => {
	let filedElem

	if (label.name === 'hours_of_service' || label.name === 'form_and_manner') {
		filedElem = (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={iconAlert} alt="alert-icon" style={{ marginRight: '5px' }} />
				<p>{rowItem}</p>
			</div>
		)
	} else if (label.name === 'dvir' || label.name === 'trip') {
		filedElem = !!rowItem === true ?
			<img src={iconDone} alt="icon-done" /> :
			<img src={iconNone} alt="icon-none" />
	} else {
		filedElem = rowItem
	}

	return (
		<StyledTableCell align={label.align ? label.align : "left"}>
			{filedElem}
		</StyledTableCell>
	)
}



const LogsTable: FC<PropsType & RouteComponentProps> = ({ labels, rows, ...props }) => {
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


	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};



	// Checkboxes
	const [selected, setSelected] = React.useState<string[]>([])
	const isSelected = (id: string) => selected.indexOf(id) !== -1;

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





	return (
		<div className="page logs-page">
			<Paper style={{ boxShadow: 'none' }}>
				<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
					<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
					FILTERS HERE
					<StyledDefaultButtonSmall variant="outlined" onClick={() => { console.log("REPORT") }}>Report</StyledDefaultButtonSmall>
				</Toolbar>

				<CustomTable subtractHeight={52}>
					<TableHead>
						<TableRow>
							<StyledTableCell>
								<Checkbox
									indeterminate={selected.length > 0 && selected.length < rows.length}
									checked={rows.length > 0 && selected.length === rows.length}
									onChange={handleSelectAllClick}
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
					<TableBody>
						{stableSort(rows, getComparator(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row: any) => {

								const isItemSelected = isSelected(row.id.toString());
								let checkBoxRef = React.createRef<any>()

								return (
									isContainsSearchText(searchText, row, [
										'date',
										'driver',
										'hours_worked',
										'distance',
										'hours_of_service',
										'form_and_manner']) &&

									<TableRow key={row.id} hover onClick={(e) => {
										if (checkBoxRef.current && !checkBoxRef.current.contains(e.target)) {
											props.history.push(`/logs/${row.id}`)
										}
									}}>
										<StyledTableCell ref={checkBoxRef}>
											<Checkbox
												checked={isItemSelected}
												color="primary"
												onClick={(event) => handleClick(event, row.id.toString())} />
										</StyledTableCell>
										{labels.map(label => checkField(label, row[label.name]))}
									</TableRow>

								)
							})}


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
		</div>

	)
}
export default withRouter(LogsTable);
