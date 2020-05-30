import React, { FC, useState, useEffect } from 'react'

import UnitsTable from './UnitsTable/UnitsTable'
import { UnitType } from '../../types/units';

import GoogleMap from '../Common/GoogleMap/GoogleMap'

type PropsType = {
	units: Array<UnitType>

	getUnits: () => void
}

const Units:FC<PropsType> = ({units, getUnits, ...props}) => {
	
	const [tableVisible, setTableVisibility] = useState(false)
	const toggleTableVisibility = () => {
		setTableVisibility(!tableVisible)
	}


	return (
		<div className="page units-page">
			<GoogleMap fullHeight={tableVisible}/>
			<UnitsTable
				rows={units}
				getUnits={getUnits}

				toggleTable={toggleTableVisibility}
				tableVisible={tableVisible}
			/>
		</div>
	)
}

export default Units;
