import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'
import { UnitType } from '../../types/units'

import { getUnitsFromServer } from '../../redux/units-reducer'

import Units from './Units'

const UnitsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const units = useSelector<AppStateType, Array<UnitType>>(state=>state.units.units)

	const getUnitsDispatch = () => {
		dispatch(getUnitsFromServer())
	}

	return (
		<Units
			units={units}
			getUnits={getUnitsDispatch}
		/>
	)
}

export default UnitsContainer;