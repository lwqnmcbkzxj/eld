import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Vehicles from './Vehicles'
import { VehicleType } from '../../types/vehicles';
import { getVehiclesFromServer } from '../../redux/vehicles-reducer';

const VehiclesContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const vehicles = useSelector<AppStateType, Array<VehicleType>>(state=>state.vehicles.vehicles)

	const getVehiclesDispatch = () => {
		dispatch(getVehiclesFromServer())
	}
	return (
		<Vehicles
			vehicles={vehicles}
		/>
	)
}

export default VehiclesContainer;