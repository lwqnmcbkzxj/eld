import React, { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from "react-helmet";
import { AppStateType } from '../../../types/types' 

const CustomHelmet = () => {
	const pageName = useSelector<AppStateType, string>(state => state.app.pageName)
	return (
		<Helmet>
			<title>{pageName}</title>
		</Helmet>
	)
}

export default CustomHelmet;
