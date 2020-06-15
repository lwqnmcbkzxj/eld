import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'
import { UserType, RolesEnum } from '../../types/user'
import UserMenu from './UserMenu'
import AdminMenu from './AdminMenu'

const MenuContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const userInfo = useSelector<AppStateType, UserType>(state => state.user.userInfo)


	return (
		userInfo.role_id === RolesEnum.company ? <UserMenu /> :
		userInfo.role_id === RolesEnum.admin ? <AdminMenu /> : <></>
	)
}

export default MenuContainer;