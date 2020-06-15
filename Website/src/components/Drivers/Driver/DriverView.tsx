import React, { FC, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import DriversTable from '../DriversTable'
import DriverPreview from './DriverPreview'
import { AppStateType } from '../../../types/types'
import { UserType } from '../../../types/user'
import { LabelType } from '../../../types/types'
import { withRouter, RouteComponentProps } from 'react-router'

import SimpeTable from '../../Common/SimpleTable/SimpleTable'
import GoogleMap from '../../Common/GoogleMap/GoogleMap'
import DriversModal from '../../Common/Modals/PagesModals/DriversModal'
import { setSearchText } from '../../../redux/logs-reducer'
import { DriverType } from '../../../types/drivers'
import { getDriversFromServer, editDriver } from '../../../redux/drivers-reducer'
import { LogsType } from '../../../types/logs'

let driverTripsValues = [
	{
		start_time: 'Mar 13, 11:04 PM',
		truck_number: '012',
		origin: '75.9 mi N of Ephrata, WA',
		distance: '40.6 mi',
		duration: '0:47',
		note: "TextTextT extTextText  Text Text ",
		trip: true
	},
	{
		start_time: 'Mar 13, 11:04 PM',
		truck_number: '012',
		origin: '75.9 mi N of Ephrata, WA',
		distance: '40.6 mi',
		duration: '0:47',
		note: "TextTextT extTextText  Text Text ",
		trip: true
	},
	{
		start_time: 'Mar 13, 11:04 PM',
		truck_number: '012',
		origin: '75.9 mi N of Ephrata, WA',
		distance: '40.6 mi',
		duration: '0:47',
		note: "TextTextT extTextText  Text Text ",
		trip: true
	}
]



type PropsType = {
	driver: UserType,

	logs: Array<LogsType>
	handleEdit: (driverObj: UserType) => void
}

const DriverView: FC<PropsType & RouteComponentProps> = ({ driver, logs, handleEdit, ...props }) => {
	const dispatch = useDispatch()
	let recentItemLabels = [
		{ label: "Date", name: 'day' }, 
		{ label: "Hours worked", name: 'on_duty_hours' }, 
		{ label: "Distance", name: 'distance' }, 

		{ label: "Hours of service", name: 'has_violation_all' },
		{ label: "Form & manner", name: 'has_signature' },
		{ label: "DVIR", name: 'has_inspection', align: 'right' },
	] as Array<LabelType>


	let tripsLabels = [
		{ label: "Start time", name: 'start_time' },
		{ label: "Truck No.", name: 'truck_number' },
		{ label: "Origin", name: 'origin' },
		{ label: "Distance", name: 'distance' },
		{ label: "Duration", name: 'duration' },
		{ label: "Note", name: 'note' },
		{ label: 'Trip', name: 'trip', align: 'right' }
	] as Array<LabelType>


	const [currentModalData, setModalData] = useState({});
	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};

	return (
		<div className={"page driver-page"}>
			<DriverPreview
				driver={driver}
				setEditModalOpen={setEditModalOpen}
				setModalData={setModalData}
			/>
			<GoogleMap

			/>


			<SimpeTable
				tableTitle="Recent item"
				button={{
					func: () => { props.history.push(`/logs`); dispatch(setSearchText(driver.user_first_name)) },
					text: "View logs"
				}}
				rows={logs}
				labels={recentItemLabels}
			/>
			<SimpeTable
				tableTitle="Trips"
				rows={driverTripsValues}
				labels={tripsLabels}
			/>

			{/* Edit modal */}
			{editModalOpen &&
				<DriversModal
					open={editModalOpen}
					handleClose={handleEditModalClose}
					initialValues={currentModalData as UserType}
					titleText={"Edit Driver"}
					submitFunction={handleEdit}
				/>}
		</div>
	)
}

export default withRouter(DriverView);
