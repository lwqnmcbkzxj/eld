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

let driverRecentItemValues = [
	{
		date: 'Mar 13',
		hours_worked: '10:30',
		distance: '201.3 mi',
		hours_of_service: 'HOS Violation',
		form_and_manner: 'Shipping docs, Driver Signature',
		dvir: true,
	},
	{
		date: 'Mar 13',
		hours_worked: '10:30',
		distance: '201.3 mi',
		hours_of_service: 'HOS Violation',
		form_and_manner: 'Shipping docs, Driver Signature',
		dvir: true,
	}
] as any
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
	driver: UserType
}

const DriverView: FC<PropsType & RouteComponentProps> = ({ driver, ...props }) => {
	const dispatch = useDispatch()
	let recentItemLabels = [
		{ label: "Date", name: 'date' },
		{ label: "Hours worked", name: 'hours_worked' },
		{ label: "Distance", name: 'distance' },
		{ label: "Hours of service", name: 'hours_of_service' },
		{ label: "Form & manner", name: 'form_and_manner' },
		{ label: "DVIR", name: 'dvir', align: 'right' },
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
					func: () => { props.history.push(`/logs`); dispatch(setSearchText("Потом тут будет имя водителя"))    },
					text: "View logs"
				}}
				rows={driverRecentItemValues}
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
				initialValues={{} as UserType}
				titleText={"Edit Driver"}
				submitFunction={() => { }}
				/>}
		</div>
	)
}

export default withRouter(DriverView);
