import { AppStateType, AlertStatusEnum } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { DriverType } from '../types/drivers'
import { toggleIsFetching, ToggleIsFetchingType } from './app-reducer'
import { vehiclesAPI, driversAPI, userAPI } from '../api/api'
import { ResultCodesEnum } from '../api/types'
import { showAlert } from '../utils/showAlert'
import { UserType } from '../types/user'

const SET_DRIVERS = 'drivers/SET_DRIVERS'
const SET_DRIVER = 'drivers/SET_DRIVER'

let initialState = {
	drivers: [] as Array<DriverType>,
	currentDriver: {} as UserType
}

type InitialStateType = typeof initialState;
type ActionsTypes =
	SetDriversType |
	SetDriverType |
	ToggleIsFetchingType;

const driversReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_DRIVERS: {
			return {
				...state,
				drivers: [...action.drivers]
			}
		}
		case SET_DRIVER: {
			return {
				...state,
				currentDriver: {...action.driver}
			}
			}
		default:
			return state;
	}
}

type SetDriversType = {
	type: typeof SET_DRIVERS,
	drivers: Array<DriverType>
}
type SetDriverType = {
	type: typeof SET_DRIVER,
	driver: UserType
}

export const setDrivers = (drivers: Array<DriverType>): SetDriversType => {
	return {
		type: SET_DRIVERS,
		drivers
	}
}
export const setDriver = (driver: UserType): SetDriverType => {
	return {
		type: SET_DRIVER,
		driver
	}
}

export const getDriversFromServer = (companyId: number, fetchingName = 'drivers'): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching(fetchingName))
	let response = await driversAPI.getDrivers(companyId)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching(fetchingName))
		dispatch(setDrivers(response.result))
	}
}
export const getDriverFromServer = (driverId: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('driver'))
	let response = await userAPI.getUserInfo(driverId)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('driver'))
		dispatch(setDriver(response.result))
	}
}
export const addDriver = (companyId: number, driverObject: UserType): ThunksType => async (dispatch) => {
	let response = await userAPI.addUser(driverObject)

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, 'Driver added successfully')
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to add driver')
	}
}
export const editDriver = (driverObject: UserType): ThunksType => async (dispatch) => {
	let response = await userAPI.editUser(driverObject)

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, 'Driver edited successfully')
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to edit driver')
	}
}



type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default driversReducer;