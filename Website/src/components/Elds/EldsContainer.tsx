import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Elds from './Elds'

const EldsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()

	return (
		<Elds />
	)
}

export default EldsContainer;