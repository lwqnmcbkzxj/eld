import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Elds from './Elds'
import { EldType } from '../../types/elds';

const EldsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const elds = useSelector<AppStateType, Array<EldType>>(state=>state.elds.elds)
	
	return (
		<Elds
			elds={elds}
		/>
	)
}

export default EldsContainer;