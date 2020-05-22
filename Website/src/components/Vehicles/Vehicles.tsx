import React, { FC, useState, useEffect } from 'react'
import './Vehicles.scss'
import { VehicleType } from '../../types/vehicles';
import VehiclesTable from './VehiclesTable'

type PropsType = {
	vehicles: Array<VehicleType>
}

const Units: FC<PropsType> = ({ vehicles, ...props }) => {

	return (
		<div className="page units-page">
			<VehiclesTable
				rows={vehicles}
			/>
		</div>
	)
}

export default Units;
