import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'
import { UserType } from '../../types/user'
import Header from './Header'

const HeaderContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	let pageName = useSelector<AppStateType, string>(state => state.app.pageName)
	let isRootPage = useSelector<AppStateType, boolean>(state => state.app.isRootPage)
	const userInfo = useSelector<AppStateType, UserType>(state => state.user.userInfo)


	return (
		<Header
			pageName={pageName}
			isRootPage={isRootPage}
			userInfo={userInfo}
		/>
	)
}

export default HeaderContainer;