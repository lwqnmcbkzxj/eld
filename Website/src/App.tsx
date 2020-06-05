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
import Loader from './components/Common/Loader/Loader'


const DriversContainer = React.lazy(() => import('./components/Drivers/DriversContainer'))
const DriverContainer = React.lazy(() => import('./components/Drivers/Driver/DriverContainer'))

const EldsContainer = React.lazy(() => import('./components/Elds/EldsContainer'))
const LogsContainer = React.lazy(() => import('./components/Logs/LogsContainer'))
const LogContainer = React.lazy(() => import('./components/Logs/Log/LogContainer'))


const UnitsContainer = React.lazy(() => import('./components/Units/UnitsContainer'))
const VehiclesContainer = React.lazy(() => import('./components/Vehicles/VehiclesContainer'))
const CompaniesContainer = React.lazy(() => import('./components/Companies/CompaniesContainer'))
const DashboardContainer = React.lazy(() => import('./components/Dashboard/DashboardContainer'))
const TripsContainer = React.lazy(() => import('./components/Trips/TripsContainer'))










const App = (props: any) => {
	const dispatch = useDispatch()
	const logged = useSelector<AppStateType, boolean>(state => state.user.logged)
	const userInfo = useSelector<AppStateType, UserType>(state => state.user.userInfo)
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)

	let pathName = props.location.pathname

	useEffect(() => {
		dispatch(authUser())
	}, [])

	useEffect(() => {
		dispatch(getPageName(pathName))
	}, [pathName])

	
	useEffect(() => {
		if (!logged) {
			props.history.push('/login')
		}
	}, [logged])

	useEffect(() => {
		if (!logged) {
			props.history.push('/login')
		}
	}, [])

	if (pathName === "/" || pathName === "/login") {
		if (userInfo.role_id === RolesEnum.user) {
			return <Redirect to="/units" />
		} else if (userInfo.role_id === RolesEnum.admin) {
			return <Redirect to="/dashboard" />
		}
	}

	if (pathName === '/login' || !logged) {
		return <Login />
	}
	

	return (
		isFetchingArray.includes('app') ? 
			<Loader style={{ height: '100vh', width: '100vw' }}/> :


		<div className="app-wrapper">
			<CustomHelmet />
			<HeaderContainer />


			<div className='app-container'>
				<MenuContainer />

				<div className="app-content">
					<Switch>
						{userInfo.role_id === RolesEnum.user ?
							<>
								<Route exact path="/drivers" render={withSuspense(DriversContainer)} />
								<Route path="/drivers/:driverId" render={withSuspense(DriverContainer)} />
								<Route path="/elds" render={withSuspense(EldsContainer)}/>
								<Route exact path="/logs"  render={withSuspense(LogsContainer)}/>
								<Route path="/logs/:logId"  render={withSuspense(LogContainer)}/>
								<Route path="/units" render={withSuspense(UnitsContainer)} />
								<Route path="/trips" render={withSuspense(TripsContainer)} />
								<Route path="/vehicles" render={withSuspense(VehiclesContainer)}/>
							</> : <>
								<Route path="/companies" render={withSuspense(CompaniesContainer)}/>
								<Route path="/dashboard" render={withSuspense(DashboardContainer)} />

								<Route exact path="/drivers" render={withSuspense(DriversContainer)} />
								<Route path="/drivers/:driverId" render={withSuspense(DriverContainer)} />
								
								<Route exact path="/logs"  render={withSuspense(LogsContainer)}/>
								<Route path="/logs/:logId"  render={withSuspense(LogContainer)}/>
							</>}

						<Route component={NotFound} />

					</Switch>

				</div>
			</div>

		</div>
	)
}

export default withRouter(App);
