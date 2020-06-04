import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import { DriverType } from '../../types/drivers';
import { getDriversFromServer } from '../../redux/drivers-reducer';
import { withRouter } from 'react-router';
import DriversTable from './DriversTable';
import { UserType } from '../../types/user';

const DriversContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const drivers = useSelector<AppStateType, Array<DriverType>>(state => state.drivers.drivers)
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)

	const getDriversDispatch = () => {
		if (loggedUser.company_id)
			dispatch(getDriversFromServer(loggedUser.company_id))
	}

	useEffect(() => {
		getDriversDispatch()
	}, [])
	
	return (
		<div className={"page drivers-page"}>
			<DriversTable
				rows={drivers}
				getDrivers={getDriversDispatch}
			/>
		</div>
	)
}

export default withRouter(DriversContainer);