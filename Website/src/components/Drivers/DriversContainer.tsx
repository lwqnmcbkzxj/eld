import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import { DriverType } from '../../types/drivers';
import { getDriversFromServer } from '../../redux/drivers-reducer';
import { withRouter } from 'react-router';
import DriversTable from './DriversTable';
import { UserType, RolesEnum } from '../../types/user';

import { addDriver, editDriver } from '../../redux/drivers-reducer'

const DriversContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const drivers = useSelector<AppStateType, Array<DriverType>>(state => state.drivers.drivers)
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)

	const getDriversDispatch = () => {
		if (loggedUser.company_id && loggedUser.role_id === RolesEnum.company)
			dispatch(getDriversFromServer(loggedUser.company_id))
		else if (loggedUser.role_id === RolesEnum.admin) {
			dispatch(getDriversFromServer(-1))
		}
	}

	useEffect(() => {
		getDriversDispatch()
	}, [])


	const addDriverDispatch = async (driverObject: UserType) => {
		await dispatch(addDriver(loggedUser.company_id, driverObject))
		getDriversDispatch()
	}
	const editDriverDispatch = async (driverObject: UserType) => {
		await dispatch(editDriver(driverObject))
		getDriversDispatch()
	}
	return (
		<div className={"page drivers-page"}>
			<DriversTable
				rows={drivers}
				getDrivers={getDriversDispatch}

				handleAdd={addDriverDispatch}
				handleEdit={editDriverDispatch}
			/>
		</div>
	)
}

export default withRouter(DriversContainer);