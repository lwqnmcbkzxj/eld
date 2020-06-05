import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../../types/types'

import DriverView from './DriverView'
import { DriverType } from '../../../types/drivers';
import { withRouter, RouteComponentProps } from 'react-router';
import { getDriversFromServer } from '../../../redux/drivers-reducer';
import { UserType } from '../../../types/user';

interface Params {
	driverId: string;
}

const DriverContainer: FC<RouteComponentProps<Params>> = ({ ...props }) => {
	const dispatch = useDispatch()
	// const driver = useSelector<AppStateType, Array<DriverType>>(state=>state.drivers.drivers)
	const driver = useSelector<AppStateType, UserType>(state => state.drivers.currentDriver)

	const driverId = props.match.params.driverId ? props.match.params.driverId : 1;

	const getDriverDispatch = () => {
		dispatch(getDriversFromServer(+driverId))
	}

	useEffect(() => {
		getDriverDispatch()
	}, [])



	return (
		<DriverView
			driver={driver}
		/>
	)
}

export default withRouter(DriverContainer);