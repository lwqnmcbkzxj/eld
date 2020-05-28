import React, { FC, useState, useEffect } from 'react'
import DriversTable from '../DriversTable'
import DriverPreview from './DriverPreview'

import DriverTable from './DriverTable'
import GoogleMap from '../../Common/GoogleMap/GoogleMap'
import { LabelType } from '../../../types/types'



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
	// driver: DriverType
}

const DriverView: FC<PropsType> = ({ ...props }) => {
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
	
	
	return (
		<div className={"page driver-page"}>
			<DriverPreview />
			<GoogleMap
				
			
			/>


			<DriverTable
				tableTitle="Recent item"
				buttonLink={"/logs"}
				rows={driverRecentItemValues}
				labels={recentItemLabels}
			/>
			<DriverTable
				tableTitle="Trips"
				rows={driverTripsValues}
				labels={tripsLabels}
			/>
		</div>
	)
}

export default DriverView;
