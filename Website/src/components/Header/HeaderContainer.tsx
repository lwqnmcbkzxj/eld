import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Header from './Header'

const HeaderContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	let pageName = useSelector<AppStateType, string>(state => state.app.pageName)
	let isRootPage = useSelector<AppStateType, boolean>(state => state.app.isRootPage)


	return (
		<Header
			pageName={pageName}
			isRootPage={isRootPage}
		/>
	)
}

export default HeaderContainer;