import React, { FC, useState, useEffect } from 'react'
import './App.scss'
import { Route, NavLink } from "react-router-dom"
import { Switch, Redirect } from 'react-router'
import { withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppStateType } from './types/types'
import { UserType, RolesEnum } from './types/user'

import { getPageName } from './redux/app-reducer'
import { authUser } from './redux/user-reducer'


import { withSuspense } from './hoc/withSuspense';

import MenuContainer from './components/Menu/MenuContainer'
import HeaderContainer from './components/Header/HeaderContainer'

// import DriversContainer from './components/Drivers/DriversContainer'
// import EldsContainer from './components/Elds/EldsContainer'
// import LogsContainer from './components/Logs/LogsContainer'
// import UnitsContainer from './components/Units/UnitsContainer'
// import VehiclesContainer from './components/Vehicles/VehiclesContainer'

// import CompaniesContainer from './components/Companies/CompaniesContainer'
// import DashboardContainer from './components/Dashboard/DashboardContainer'


import NotFound from './components/NotFound/NotFound'

import CustomHelmet from './components/Common/CustomHelmet/CustomHelmet'
import Login from './components/Login/Login'


const DriversContainer = React.lazy(() => import('./components/Drivers/DriversContainer'))
const EldsContainer = React.lazy(() => import('./components/Elds/EldsContainer'))
const LogsContainer = React.lazy(() => import('./components/Logs/LogsContainer'))
const UnitsContainer = React.lazy(() => import('./components/Units/UnitsContainer'))
const VehiclesContainer = React.lazy(() => import('./components/Vehicles/VehiclesContainer'))
const CompaniesContainer = React.lazy(() => import('./components/Companies/CompaniesContainer'))
const DashboardContainer = React.lazy(() => import('./components/Dashboard/DashboardContainer'))










const App = (props: any) => {
	const dispatch = useDispatch()
	const logged = useSelector<AppStateType, boolean>(state => state.user.logged)
	const userInfo = useSelector<AppStateType, UserType>(state => state.user.userInfo)
	let pathName = props.location.pathname

	useEffect(() => {
		dispatch(authUser())
	}, [])

	useEffect(() => {
		dispatch(getPageName(pathName))
	}, [pathName])

	
	if (!logged && !userInfo.token) {
		return <>
			{/* <Redirect to="/" /> */}
			<Login />
		</>
	}
	if (pathName === "/") {
		if (userInfo.role_id === RolesEnum.user) {
			return <Redirect to="/units" />
		} else if (userInfo.role_id === RolesEnum.admin) {
			return <Redirect to="/dashboard" />
		}
	}
		


	

	return (
		<div className="app-wrapper">
			<CustomHelmet />
			<HeaderContainer />

			<div className='app-container'>
				<MenuContainer />

				<div className="app-content">
					<Switch>
						{userInfo.role_id === RolesEnum.user ?
							<>
								<Route path="/drivers" render={withSuspense(DriversContainer)} />
								<Route path="/elds" render={withSuspense(EldsContainer)}/>
								<Route path="/logs"  render={withSuspense(LogsContainer)}/>
								<Route path="/units" render={withSuspense(UnitsContainer)} />
								<Route path="/vehicles" render={withSuspense(VehiclesContainer)}/>
							</> : <>
								<Route path="/companies" render={withSuspense(CompaniesContainer)}/>
								<Route path="/dashboard" render={withSuspense(DashboardContainer)} />
							</>}

						<Route component={NotFound} />

					</Switch>

				</div>
			</div>

		</div>
	)
}

export default withRouter(App);
