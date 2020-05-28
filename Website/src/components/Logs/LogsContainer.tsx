import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType, LabelType } from '../../types/types'

import LogsTable from './LogsTable'

const LogsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()

	let labels = [
		{ label: 'Date', name: 'date' },
		{ label: 'Driver', name: 'driver' },
		{ label: 'Hours worked', name: 'hours_worked', align: 'right' },
		{ label: 'Distance', name: 'distance', align: 'right' },
		{ label: 'Hours of service', name: 'hours_of_service' },
		{ label: 'Form & manner', name: 'form_and_manner' },
		{ label: 'DVIR', name: 'dvir' },
	]as Array<LabelType>

	let logs = [
		{
			date: 'Mar 14',
			driver: '1Bruce Wayne',
			hours_worked: 'q10:30',
			distance: 'q201.3 mi',
			hours_of_service: 'qHOS Violation',
			form_and_manner: 'qDriver signature',
			dvir: true,
		},
		{
			date: 'Mar 13',
			driver: '2Bruce Wayne',
			hours_worked: '10:30',
			distance: '201.3 mi',
			hours_of_service: 'HOS Violation',
			form_and_manner: 'Driver signature',
			dvir: false,
		},
	]

	return (
		<LogsTable
			labels={labels}
			rows={logs}
		/>
	)
}

export default LogsContainer;