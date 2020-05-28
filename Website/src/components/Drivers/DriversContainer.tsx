import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Drivers from './Drivers'
import { DriverType } from '../../types/drivers';
import { getDriversFromServer } from '../../redux/drivers-reducer';
import { withRouter } from 'react-router';

const DriversContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const drivers = useSelector<AppStateType, Array<DriverType>>(state=>state.drivers.drivers)

	const getDriversDispatch = () => {
		dispatch(getDriversFromServer())
	}



	return (
		<Drivers
			drivers={drivers}
			getDrivers={getDriversDispatch}
		/>
	)
}

export default withRouter(DriversContainer);