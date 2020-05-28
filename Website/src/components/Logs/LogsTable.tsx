import React, { FC, useState, useEffect } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
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

	return (
		<div className="page logs-page">
			<Paper style={{ boxShadow: 'none' }}>
				<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
					<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
					<StyledDefaultButtonSmall variant="outlined" onClick={() => { console.log("REPORT") }}>Report</StyledDefaultButtonSmall>
				</Toolbar>

				<CustomTable subtractHeight={52}>
					<TableHead>
						<TableRow>
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
							.map((row: any) => (

							isContainsSearchText(searchText, row, [
								'date',
								'driver',
								'hours_worked',
								'distance',
								'hours_of_service',
								'form_and_manner']) &&

							<TableRow key={row.id} hover onClick={() => { props.history.push(`/logs/${row.id}`) }}>
								{labels.map(label => checkField(label, row[label.name]))}
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
		</div>

	)
}
export default withRouter(LogsTable);
