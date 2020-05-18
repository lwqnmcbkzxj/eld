import React, { FC, useState, useEffect } from 'react'
import './App.scss'
import { Route, NavLink } from "react-router-dom"
import { Switch, Redirect } from 'react-router'
import { withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppStateType } from './types/types'

import { getPageName } from './redux/app-reducer' 

import MenuContainer from './components/Menu/MenuContainer'
import HeaderContainer from './components/Header/HeaderContainer'

import DriversContainer from './components/Drivers/DriversContainer'
import EldsContainer from './components/Elds/EldsContainer'
import LogsContainer from './components/Logs/LogsContainer'
import UnitsContainer from './components/Units/UnitsContainer'
import VehiclesContainer from './components/Vehicles/VehiclesContainer'
import NotFound from './components/NotFound/NotFound'

import CustomHelmet from './components/Common/CustomHelmet/CustomHelmet'
import Login from './components/Login/Login'

const App = (props: any) => {
	const dispatch = useDispatch()
	const logged = useSelector<AppStateType, boolean>(state => state.user.logged)
	let pathName = props.location.pathname

	useEffect(() => {
		dispatch(getPageName(pathName))
	}, [pathName])

	if (!logged) {
		return <>
			<Redirect to="/" />
			<Login />
		</>
	}
		

	if (pathName === "/")
		return <Redirect to="/units" />
	return (
		<div className="app-wrapper">
			<CustomHelmet />
			<HeaderContainer />

			<div className='app-container'>
			<MenuContainer />

				<div className="app-content">
					<Switch>
						<Route path="/drivers" render={()=> <DriversContainer /> } />
						<Route path="/elds" render={()=> <EldsContainer /> } />
						<Route path="/logs" render={()=> <LogsContainer /> } />
						<Route path="/units" render={()=> <UnitsContainer /> } />
						<Route path="/vehicles" render={()=> <VehiclesContainer /> } />
						<Route component={NotFound} />

					</Switch>

				</div>
			</div>

		</div>
	)
}

export default withRouter(App);
