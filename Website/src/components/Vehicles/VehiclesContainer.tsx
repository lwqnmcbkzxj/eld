import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import VehiclesTable from './VehiclesTable'
import { VehicleType } from '../../types/vehicles';
import { getVehiclesFromServer } from '../../redux/vehicles-reducer';
import { UserType } from '../../types/user';

import { deleteVehicle, activateVehicle } from '../../redux/vehicles-reducer'

const VehiclesContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const vehicles = useSelector<AppStateType, Array<VehicleType>>(state => state.vehicles.vehicles)

	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)

	const getVehiclesDispatch = () => {
		dispatch(getVehiclesFromServer(loggedUser.company_id))
	}

	useEffect(() => {
		getVehiclesDispatch()
	}, [])


	const activateVehicleDispatch = async (vehicleId: number) => {
		await dispatch(activateVehicle(vehicleId))
	}

	const deleteVehicleDispatch = async (vehicleId: number) => {
		await dispatch(deleteVehicle(vehicleId))

		getVehiclesDispatch()
	}

	return (
		<div className="page units-page">
			<VehiclesTable
				rows={vehicles}
				handleActivate={activateVehicleDispatch}
				handleDelete={deleteVehicleDispatch}
			/>
		</div>
	)
}

export default VehiclesContainer;