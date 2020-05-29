import React, { FC, useState, useEffect } from 'react'

import UnitsTable from './UnitsTable/UnitsTable'
import { UnitType } from '../../types/units';

import GoogleMap from '../Common/GoogleMap/GoogleMap'

type PropsType = {
	units: Array<UnitType>

	getUnits: () => void
}

const Units:FC<PropsType> = ({units, getUnits, ...props}) => {
	
	return (
		<div className="page units-page">
			<GoogleMap />
			<UnitsTable
				rows={units}
				getUnits={getUnits}
			/>
		</div>
	)
}

export default Units;
