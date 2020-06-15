import { AppStateType, StatusEnum, AlertStatusEnum } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { VehicleType } from '../types/vehicles'

import { vehiclesAPI } from '../api/api'
import { ResultCodesEnum } from '../api/types'
import { showAlert } from '../utils/showAlert'

import { ToggleIsFetchingType, toggleIsFetching } from './app-reducer'

const SET_VEHICLES = 'vehicles/SET_VEHICLES'
const SET_VEHICLE = 'vehicles/SET_VEHICLE'

let initialState = {
	vehicles: [] as Array<VehicleType>,
	currentVehicle: {} as VehicleType,
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetVehiclesType | SetVehicleType | ToggleIsFetchingType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_VEHICLES: {
			return {
				...state,
				vehicles: [...action.vehicles.filter(vehicle => vehicle.vehicle_status !== StatusEnum.DELETED)]
			}
		}
		case SET_VEHICLE: {
			return {
				...state,
				currentVehicle: action.vehicle
			}
		}
		default:
			return state;
	}
}

type SetVehiclesType = {
	type: typeof SET_VEHICLES,
	vehicles: Array<VehicleType>
}
type SetVehicleType = {
	type: typeof SET_VEHICLE,
	vehicle: VehicleType
}

export const setVehicles = (vehicles: Array<VehicleType>): SetVehiclesType => {
	return {
		type: SET_VEHICLES,
		vehicles
	}
}
export const setVehicle = (vehicle: VehicleType): SetVehicleType => {
	return {
		type: SET_VEHICLE,
		vehicle
	}
}
export const getVehiclesFromServer = (companyId: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('vehicles'))
	let response = await vehiclesAPI.getVehicles(companyId)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('vehicles'))
		dispatch(setVehicles(response.result))
	}
}
export const getVehicleFromServer = (vehicleId: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('vehicle'))
	let response = await vehiclesAPI.getVehicle(vehicleId)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('vehicle'))
		dispatch(setVehicle(response.result))
	}
}






export const addVehicle = (companyId: number, vehicle: VehicleType): ThunksType => async (dispatch) => { 
	let response = await vehiclesAPI.addVehicle(companyId, vehicle)

	if (response.status === ResultCodesEnum.Success) {
		showAlert('success', 'Vehicle added successfully')
	} else {
		showAlert('error', 'Failed to add vehicle')
	}
}
export const editVehicle = (vehicle: VehicleType): ThunksType => async (dispatch) => { 
	let response = await vehiclesAPI.editVehicle(vehicle)

	if (response.status === ResultCodesEnum.Success) {
		showAlert('success', 'Vehicle edited successfully')
	} else {
		showAlert('error', 'Failed to edit vehicle')
	}
}

export const deleteVehicle = (id: number, companyId: number): ThunksType => async (dispatch) => {
	let response = await vehiclesAPI.deleteVehicle(id)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(getVehiclesFromServer(companyId))
	} else {
		showAlert('error', 'Failed to delete vehicle')
	}
}

export const toggleVehicleActivation = (id: number, status: StatusEnum, companyId: number): ThunksType => async (dispatch) => {
	let response
	if (status === StatusEnum.DEACTIVATED) {
		response = await vehiclesAPI.activateVehicle(id)
	} else {
		response = await vehiclesAPI.deactivateVehicle(id)
	}

	let statusText = status === StatusEnum.DEACTIVATED ? 'activate' : 'deactivate'

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, `Vehicle ${statusText}d successfully`)
		dispatch(getVehiclesFromServer(companyId))
	} else {
		showAlert(AlertStatusEnum.Error, `Failed to ${statusText} vehicle`)
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;