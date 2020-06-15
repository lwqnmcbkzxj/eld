import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../../types/types'

import DriverView from './DriverView'
import { DriverType } from '../../../types/drivers';
import { withRouter, RouteComponentProps } from 'react-router';
import { getDriverFromServer, editDriver } from '../../../redux/drivers-reducer';
import { UserType } from '../../../types/user';
import { LogsType } from '../../../types/logs';
import { getLogsFromServer } from '../../../redux/logs-reducer';
import moment from 'moment';

interface Params {
	driverId: string;
}

const DriverContainer: FC<RouteComponentProps<Params>> = ({ ...props }) => {
	const dispatch = useDispatch()
	const driver = useSelector<AppStateType, UserType>(state => state.drivers.currentDriver)
	const logs = useSelector<AppStateType, Array<LogsType>>(state => state.logs.logs)
	const driverId = props.match.params.driverId ? props.match.params.driverId : 1;

	const getDriverDispatch = () => {
		dispatch(getDriverFromServer(+driverId))

		let currentDate = moment().format('YYYY-MM-DD')
		dispatch(getLogsFromServer(currentDate, 14, +driverId))
	}

	useEffect(() => {
		getDriverDispatch()
	}, [])

	const editDriverDisp = async (driverObject: UserType) => {
		await dispatch(editDriver(driverObject))
		
		getDriverDispatch()
	}



	logs.map(log => {
		if (log.has_violation_11h || log.has_violation_14h || log.has_violation_70h)
			log.has_violation_all = "HOS Violation"
		else 
			log.has_violation_all = ""
		
		if (log.has_signature )
			log.has_signature = "Shipping docs, Driver Signature"
		else 
			log.has_signature = ""
		
		let workingMinutes = +log.on_duty_seconds / 60
		let workingHours = (workingMinutes / 60).toFixed(0)
		workingMinutes %= 60

		log.on_duty_hours = `${workingHours.padStart(2, '0')}:${workingMinutes.toString().padStart(2, '0')}`

		log.day = moment(log.day).format("MMMM D")
	})


	return (
		<DriverView
			driver={driver}

			logs={logs}
			handleEdit={editDriverDisp}
		/>
	)
}

export default withRouter(DriverContainer);