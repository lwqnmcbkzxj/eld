import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../../types/types'

import LogView from './LogView'
import { DriverType } from '../../../types/drivers';
import { withRouter } from 'react-router';

const LogContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	// const driver = useSelector<AppStateType, Array<DriverType>>(state=>state.drivers.drivers)
	const driver = {}

	// const getDriversDispatch = () => {
	// 	dispatch(getDriversFromServer())
	// }


	

	return (
		<LogView />
	)
}

export default withRouter(LogContainer);