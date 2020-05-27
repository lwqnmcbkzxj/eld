import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { VehicleType } from '../../types/vehicles'
import VehicleModal from '../Common/Modals/PagesModals/VehiclesModal'
import { isContainsSearchText } from '../../utils/isContainsSearchText'

type PropsType = {
	rows: Array<VehicleType>

	handleActivate: (id: number) => void
	handleDelete: (id: number) => void
}
type Order = 'asc' | 'desc';
const DriversTable: FC<PropsType> = ({ rows, handleActivate, handleDelete, ...props }) => {
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
	const [orderBy, setOrderBy] = React.useState(labels[0].label);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};





	const [vehicleEditModalOpen, setVehicleEditModalOpen] = useState(false)
	const handleVehicleEditModalClose = () => {
		setVehicleEditModalOpen(false);
	};


	const [currentVehicleData, setCurrentVehicleData] = useState({});

	const [vehicleAddModalOpen, setVehicleAddModalOpen] = useState(false)
	const handleVehicleAddModalClose = () => {
		setVehicleAddModalOpen(false);
	};


	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={() => { setVehicleAddModalOpen(true) }}>Add vehicle</StyledDefaultButtonSmall>
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



					{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
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
								setVehicleEditModalOpen(true);
								setCurrentVehicleData(row)
							}}

						>
							<StyledTableCell>{row.vehicle_truck_number}</StyledTableCell>
							<StyledTableCell>{row.vehicle_make_name}</StyledTableCell>
							<StyledTableCell>{row.vehicle_model_name}</StyledTableCell>
							<StyledTableCell>{row.vehicle_licence_plate}</StyledTableCell>
							<StyledTableCell>{row.eld_serial_number}</StyledTableCell>
							<StyledTableCell><div className="text-block" style={{ minWidth: '200px', maxWidth: '300px' }} >{row.vehicle_notes}</div></StyledTableCell>
							<StyledTableCell><StatusLabel text={row.vehicle_status} /></StyledTableCell>

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
			{vehicleEditModalOpen &&
				<VehicleModal
					open={vehicleEditModalOpen}
					handleClose={handleVehicleEditModalClose}
					initialValues={currentVehicleData}
					titleText={"Edit Vehicle"}
					handleActivate={handleActivate}
					handleDelete={handleDelete}
				/>}

			{/* Add modal */}
			{vehicleAddModalOpen &&
				<VehicleModal
					open={vehicleAddModalOpen}
					handleClose={handleVehicleAddModalClose}
					initialValues={{}}
					titleText={"Add Vehicle"}
				/>}
		</Paper>
	)
}

export default DriversTable;
