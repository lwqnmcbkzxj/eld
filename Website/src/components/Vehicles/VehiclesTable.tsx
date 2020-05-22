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
}
type Order = 'asc' | 'desc';
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


	let currentModalData = {
		id: 1,
		truck_number: '012',
		eld_number: 'Vehicle-012-2B250D69',
		make: 'Mack',
		model: 'Anthem',
		year: '2012',
		fuel_type: 'Diesel',
		licence_number: '1586-986-78-562-3',
		state: 'Illinois',
		enter_vin_manually: false,
		vin_number: '3AKJIFJIEF94850IF94',
	}

	const [currentVehicleData, setCurrentVehicleData] = useState(currentModalData);

	const [vehicleAddModalOpen, setVehicleAddModalOpen] = useState(false)
	const handleVehicleAddModalClose = () => {
		setVehicleAddModalOpen(false);
	};


	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={()=>{ setVehicleAddModalOpen(true) }}>Add vehicle</StyledDefaultButtonSmall>
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
						isContainsSearchText(searchText, row, ['make', 'model', 'license', 'eldNumber']) &&	

						<TableRow
							key={row.id}
							hover
							onClick={() => {
								setVehicleEditModalOpen(true);
								// setCurrentVehicleData(row)
							}}
						
						>
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


			{/* Edit modal */}
			{vehicleEditModalOpen &&
				<VehicleModal
					open={vehicleEditModalOpen}
					handleClose={handleVehicleEditModalClose}
					initialValues={currentVehicleData}
					titleText={"Edit Vehicle"}
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
