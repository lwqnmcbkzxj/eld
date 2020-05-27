import React, { FC, useState, useEffect } from 'react'
import DriversTable from './DriversTable'
import { DriverType } from '../../types/drivers';

type PropsType = {
	drivers: Array<DriverType>
	getDrivers: () => void
}

const Drivers:FC<PropsType> = ({ drivers, ...props }) => {
	
	return (
		<div className="page drivers-page">
			<DriversTable
				rows={drivers}
			/>
			
		</div>
	)
}

export default Drivers;
