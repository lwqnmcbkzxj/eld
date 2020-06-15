import { AppStateType, AlertStatusEnum, StatusEnum } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { DriverType } from '../types/drivers'
import { toggleIsFetching, ToggleIsFetchingType } from './app-reducer'
import { vehiclesAPI, driversAPI, userAPI } from '../api/api'
import { ResultCodesEnum } from '../api/types'
import { showAlert } from '../utils/showAlert'
import { UserType } from '../types/user'

const SET_DRIVERS = 'drivers/SET_DRIVERS'
const SET_MODAL_DRIVERS = 'drivers/SET_MODAL_DRIVERS'

const SET_DRIVER = 'drivers/SET_DRIVER'

let initialState = {
	drivers: [] as Array<DriverType>,
	modalDrivers: [] as Array<DriverType>,
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
				drivers: [...action.drivers.filter(driver => driver.user_status !== StatusEnum.DELETED)]
			}
		}
		case SET_MODAL_DRIVERS: {
			return {
				...state,
				modalDrivers: [...action.drivers.filter(driver => driver.user_status !== StatusEnum.DELETED && driver.user_status !== StatusEnum.DEACTIVATED)]
			}
		}
		case SET_DRIVER: {
			return {
				...state,
				currentDriver: { ...action.driver }
			}
		}
		default:
			return state;
	}
}

type SetDriversType = {
	type: typeof SET_DRIVERS | typeof SET_MODAL_DRIVERS,
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
export const setModalDrivers = (drivers: Array<DriverType>): SetDriversType => {
	return {
		type: SET_MODAL_DRIVERS,
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
		if (fetchingName === 'drivers-modal') {
			dispatch(setModalDrivers(response.result))
		}
		else
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
		if (response.status === ResultCodesEnum.ExistsLogin)
			showAlert(AlertStatusEnum.Error, 'Driver with that login already exists')
		else
			showAlert(AlertStatusEnum.Error, 'Failed to add driver')
	}
}
export const editDriver = (driverObject: UserType): ThunksType => async (dispatch) => {
	let response = await userAPI.editUser(driverObject)

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, 'Driver edited successfully')
	} else {
		if (response.status === ResultCodesEnum.ExistsLogin)
			showAlert(AlertStatusEnum.Error, 'Driver with that login already exists')
		else
			showAlert(AlertStatusEnum.Error, 'Failed to edit driver')
	}
}

export const deleteDriver = (id: number, companyId: number): ThunksType => async (dispatch) => {
	let response = await userAPI.deleteUser(id)

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, 'Driver deleted successfully')
		dispatch(getDriversFromServer(companyId))
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to delete driver')
	}
}

export const toggleDriverActivation = (id: number, status: StatusEnum, companyId: number): ThunksType => async (dispatch) => {
	let response
	if (status === StatusEnum.DEACTIVATED) {
		response = await userAPI.activateUser(id)
	} else {
		response = await userAPI.deactivateUser(id)
	}

	let statusText = status === StatusEnum.DEACTIVATED ? 'activate' : 'deactivate'
	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, `Driver ${statusText}d successfully`)
		dispatch(getDriversFromServer(companyId))
	} else {
		showAlert(AlertStatusEnum.Error, `Failed to ${statusText} driver`)
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default driversReducer;