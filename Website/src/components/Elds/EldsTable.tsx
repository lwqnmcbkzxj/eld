import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux';

import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';

import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'
import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { AppStateType } from '../../types/types';
import { EldType } from '../../types/elds'

import { isContainsSearchText } from '../../utils/isContainsSearchText'
import { isFetchingArrContains } from '../../utils/isFetchingArrayContains';
import { getComparator, stableSort } from '../../utils/tableFilters'

import EldsModal from '../Common/Modals/PagesModals/EldsModal'
import Loader from '../Common/Loader/Loader';

type PropsType = {
	rows: Array<EldType>
	handleAdd: (dataObj: EldType) => void
	handleEdit: (dataObj: EldType) => void
	handleDelete: (id: number) => void
}
type Order = 'asc' | 'desc';

const EldsTable: FC<PropsType> = ({ rows, handleAdd, handleEdit, handleDelete, ...props }) => {
	const [searchText, setSearchText] = React.useState("")

	// MODALS
	const [currentModalData, setCurrentModalData] = useState({});

	const [addModalOpen, setAddModalOpen] = useState(false)
	const handleAddModalClose = () => {
		setAddModalOpen(false);
	};
	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};
	// MODALS


	let labels = [
		{ label: "ELD No.", name: 'eld_serial_number' },
		{ label: "Notes", name: 'eld_note' },
	]
	// SORTING
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {

		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	// SORTING

	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)

	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={() => { setAddModalOpen(true) }}>Add ELD</StyledDefaultButtonSmall>
			</Toolbar>

			<CustomTable>
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
					{!isFetchingArrContains(isFetchingArray, ['elds']) &&
						
						stableSort(rows, getComparator(order, orderBy))
						.map(row => (
						isContainsSearchText(searchText, row, ['eld_serial_number']) &&
						<TableRow key={row.eld_id} onDoubleClick={() => {
							setCurrentModalData(row)
							setEditModalOpen(true)
						}}>
							<StyledTableCell style={{ width: '200px' }} >{row.eld_serial_number}</StyledTableCell>
							<StyledTableCell><div className="text-block" style={{ minWidth: '200px' }} >{row.eld_note}</div></StyledTableCell>
						</TableRow>
					))}
				</TableBody>
			</CustomTable>

			{isFetchingArrContains(isFetchingArray, ['elds']) && <Loader />}

			{/* Edit modal */}
			{editModalOpen &&
				<EldsModal
					open={editModalOpen}
					handleClose={handleEditModalClose}
					submitFunction={handleEdit}
					deleteFunction={handleDelete}
					initialValues={currentModalData}
					titleText={"Edit ELD"}
				/>}

			{/* Add modal */}
			{addModalOpen &&
				<EldsModal
					open={addModalOpen}
					handleClose={handleAddModalClose}
					submitFunction={handleAdd}
					initialValues={{}}
					titleText={"Add ELD"}
				/>}

		</Paper>
	)
}

export default EldsTable;
