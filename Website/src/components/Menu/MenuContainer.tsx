import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'
import {Helmet} from "react-helmet";

import UserMenu from './UserMenu'
import AdminMenu from './AdminMenu'

const MenuContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()

	return (
		true ? 
			<UserMenu /> :
			<AdminMenu />
	)
}

export default MenuContainer;