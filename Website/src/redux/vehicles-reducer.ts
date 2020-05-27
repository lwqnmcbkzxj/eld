import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { VehicleType } from '../types/vehicles'

import { vehiclesAPI } from '../api/api'
import { ResultCodesEnum } from '../api/types'
import { showAlert } from '../utils/showAlert'

const SET_VEHICLES = 'SET_VEHICLES'

let initialState = {
	vehicles: [] as Array<VehicleType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetVehiclesType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_VEHICLES: {
			return {
				...state,
				vehicles: [...action.vehicles]
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

export const setVehicles = (vehicles: Array<VehicleType>): SetVehiclesType => {
	return {
		type: SET_VEHICLES,
		vehicles
	}
}

export const getVehiclesFromServer = (companyId: number): ThunksType => async (dispatch) => {
	let response = await vehiclesAPI.getVehicles(companyId)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(setVehicles(response.result))
	}
}


export const deleteVehicle = (id: number): ThunksType => async (dispatch) => {
	let response = await vehiclesAPI.deleteVehicle(id)

	if (response.status === ResultCodesEnum.Success) {
		// dispatch(getVehiclesFromServer())
	} else {
		showAlert('error', 'Failed to delete vehicle')
	}
}

export const activateVehicle = (id: number): ThunksType => async (dispatch) => { 
	let response = await vehiclesAPI.activateVehicle(id)

	if (response.status === ResultCodesEnum.Success) {
		
	} else {
		showAlert('error', 'Failed to toggle active status')
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;