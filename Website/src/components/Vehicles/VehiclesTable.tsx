import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { VehicleType } from '../../types/vehicles'
import VehicleModal from '../Common/Modals/PagesModals/VehiclesModal'
import { isContainsSearchText } from '../../utils/isContainsSearchText'


import { getVehicleFromServer } from '../../redux/vehicles-reducer'
import { useSelector, useDispatch } from 'react-redux';
import { AppStateType } from '../../types/types';
import Loader from '../Common/Loader/Loader';
import { isFetchingArrContains } from '../../utils/isFetchingArrayContains';
import { stableSort, getComparator } from '../../utils/tableFilters'

type PropsType = {
	rows: Array<VehicleType>

	handleAdd: (vehicle: VehicleType) => void
	handleEdit: (vehicle: VehicleType) => void

}
type Order = 'asc' | 'desc';
const DriversTable: FC<PropsType> = ({ rows, handleAdd, handleEdit, ...props }) => {
	const dispatch = useDispatch()
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
		{ label: "Truck No.", name: "vehicle_truck_number" },
		{ label: "Make", name: "vehicle_make_name" },
		{ label: "Model", name: "vehicle_model_name" },
		{ label: "License Plate No.", name: "vehicle_licence_plate" },
		{ label: "ELD No.", name: "eld_serial_number" },
		{ label: "Notes", name: "vehicle_notes" },
		{ label: "Status", name: "vehicle_status" },
	]

	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};


	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};

	// const [currentModalData, setCurrentModalData] = useState({});

	const [addModalOpen, setAddModalOpen] = useState(false)
	const handleAddModalClose = () => {
		setAddModalOpen(false);
	};



	const vehicle = useSelector<AppStateType, VehicleType>(state => state.vehicles.currentVehicle)
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)

	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={() => { setAddModalOpen(true) }}>Add vehicle</StyledDefaultButtonSmall>
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
					{!isFetchingArrContains(isFetchingArray, ['vehicles']) &&

						stableSort(rows as any | Array<VehicleType>, getComparator(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
								isContainsSearchText(searchText, row, [
									'vehicle_truck_number',
									'vehicle_make_name',
									'vehicle_model_name',
									'vehicle_licence_plate',
									'eld_serial_number',
									'vehicle_notes']) &&

								<TableRow
									key={row.vehicle_id}
									hover
									onDoubleClick={() => {
										setEditModalOpen(true);
										if (row.vehicle_id)
											dispatch(getVehicleFromServer(+row.vehicle_id))
									}}

								>
									<StyledTableCell>{row.vehicle_truck_number}</StyledTableCell>
									<StyledTableCell>{row.vehicle_make_name}</StyledTableCell>
									<StyledTableCell>{row.vehicle_model_name}</StyledTableCell>
									<StyledTableCell>{row.vehicle_licence_plate}</StyledTableCell>
									<StyledTableCell>{row.eld_serial_number}</StyledTableCell>
									<StyledTableCell><div className="text-block" style={{ minWidth: '200px', maxWidth: '300px' }} >{row.vehicle_notes}</div></StyledTableCell>
									<StyledTableCell><StatusLabel text={row.vehicle_status as any} /></StyledTableCell>

								</TableRow>
							))}
				</TableBody>
			</CustomTable>
			{isFetchingArrContains(isFetchingArray, ['vehicles']) && <Loader />}


			<CustomPaginator
				length={rows.length}
				rowsPerPage={rowsPerPage}
				currentPage={page}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>


			{/* Edit modal */}
			{editModalOpen &&
				<VehicleModal
					open={editModalOpen}
					handleClose={handleEditModalClose}
					initialValues={vehicle}
					titleText={"Edit Vehicle"}
					confirmFunction={handleEdit}
				/>}

			{/* Add modal */}
			{addModalOpen &&
				<VehicleModal
					open={addModalOpen}
					handleClose={handleAddModalClose}
					initialValues={{} as VehicleType}
					titleText={"Add Vehicle"}
					confirmFunction={handleAdd}
				/>}
		</Paper>
	)
}

export default DriversTable;
