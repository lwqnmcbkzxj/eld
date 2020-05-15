import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Logs from './Logs'

const LogsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()

	return (
		<Logs />
	)
}

export default LogsContainer;