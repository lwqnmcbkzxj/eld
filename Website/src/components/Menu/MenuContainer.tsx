import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'
import { UserType } from '../../types/user'
import UserMenu from './UserMenu'
import AdminMenu from './AdminMenu'

const MenuContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const userInfo = useSelector<AppStateType, UserType>(state => state.user.userInfo)


	return (
		userInfo.role === 0 ? <UserMenu /> :
		userInfo.role === 1 ? <AdminMenu /> : <></>
	)
}

export default MenuContainer;