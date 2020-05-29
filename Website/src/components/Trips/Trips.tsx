import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, Toolbar } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'

import { isContainsSearchText } from '../../utils/isContainsSearchText'
import { LabelType } from '../../types/types'
import TripsModal from '../Common/Modals/PagesModals/TripsModal'

import iconDone from '../../assets/img/mark_done.svg'
import iconProgress from '../../assets/img/mark_progress.svg'
import { getComparator, stableSort } from '../../utils/tableFilters'

type PropsType = {
	rows: Array<any>
	labels: Array<LabelType>
}
type Order = 'asc' | 'desc';
const DriversTable: FC<PropsType> = ({ rows, labels, ...props }) => {
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

	const [currentModalData, setCurrentModalData] = useState({});
	const [editModalOpen, setEditModalOpen] = useState(false)
	const handlEditModalClose = () => {
		setEditModalOpen(false);
	};



	const checkField = (label: LabelType, rowItem: string) => {
		let filedElem

		if (label.name === 'note') {
			filedElem = <div className="text-block">{rowItem}</div>
		} else if (label.name === 'trip') {
			filedElem = !!rowItem === true ?
				<img src={iconDone} alt="icon-done" /> :
				<img src={iconProgress} alt="icon-progress" />
		} else {
			filedElem = rowItem
		}

		return (
			<StyledTableCell align={label.align ? label.align : "left"}>
				{filedElem}
			</StyledTableCell>
		)
	}

	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				 FILTERS HERE 
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

					{stableSort(rows as any, getComparator(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map(row => (
						isContainsSearchText(searchText, row, [
							'start_time',
							'driver_name',
							'truck_number',
							'origin',
							'distance',
							'duration',
							'note']) &&

						<TableRow
							key={row.id}
							hover
								onDoubleClick={() => {
								setCurrentModalData(row)
								setEditModalOpen(true);
							}}
						>
							<StyledTableCell>{row.start_time}</StyledTableCell>
							<StyledTableCell>{row.driver_name}</StyledTableCell>
							<StyledTableCell>{row.truck_number}</StyledTableCell>
							<StyledTableCell><StatusLabel text={"Status"} /></StyledTableCell>
							<StyledTableCell>{row.origin}</StyledTableCell>
							<StyledTableCell>{row.distance}</StyledTableCell>
							<StyledTableCell>{row.duration}</StyledTableCell>
							<StyledTableCell><div className="text-block">{row.note}</div></StyledTableCell>
							<StyledTableCell>
								{row.trip ?
									<img src={iconDone} alt="icon-done" /> :
									<img src={iconProgress} alt="icon-progress" />}
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
				<TripsModal
					labels={labels}

					open={editModalOpen}
					handleClose={handlEditModalClose}
					submitFunction={() => { console.log("EDITING") }}
					initialValues={currentModalData}
					titleText={"Edit Note"}
				/>}
		</Paper>
	)
}

export default DriversTable;
