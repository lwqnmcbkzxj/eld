import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../../types/types'

import DriverView from './DriverView'
import { DriverType } from '../../../types/drivers';
import { withRouter } from 'react-router';

const DriverContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	// const driver = useSelector<AppStateType, Array<DriverType>>(state=>state.drivers.drivers)
	const driver = {}

	// const getDriversDispatch = () => {
	// 	dispatch(getDriversFromServer())
	// }


	

	return (
		<DriverView />
	)
}

export default withRouter(DriverContainer);