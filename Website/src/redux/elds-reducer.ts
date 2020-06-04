import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'
import { EldType } from '../types/elds'
import { eldsAPI } from '../api/api'

import { showAlert } from '../utils/showAlert'
import { AlertStatusEnum } from '../types/types'
import { toggleIsFetching, ToggleIsFetchingType } from './app-reducer'

const SET_ELDS = 'elds/SET_ELDS'
const SET_ELD = 'elds/SET_ELD'

let initialState = {
	elds: [ ] as Array<EldType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetEldsType | SetEldType | ToggleIsFetchingType;

const eldsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_ELDS: {
			return {
				...state,
				elds: [...action.elds]
			}
		}
		
		default:
			return state;
	}
}

type SetEldsType = {
	type: typeof SET_ELDS,
	elds: Array<EldType>
}
type SetEldType = {
	type: typeof SET_ELD,
	eld: EldType
}
export const setElds = (elds: Array<EldType>): SetEldsType => {
	return {
		type: SET_ELDS,
		elds
	}
}
export const setEld = (eld: EldType): SetEldType => {
	return {
		type: SET_ELD,
		eld
	}
}
export const getEldsFromServer = (companyId: number, page?: number, limit?: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('elds'))
	let response = await eldsAPI.getElds(companyId, page, limit)
	if (response.status === 0) {
		dispatch(setElds(response.result))
		dispatch(toggleIsFetching('elds'))
	}
}
export const getEldFromServer = (id: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('eld'))
	let response = await eldsAPI.getEld(id)
	if (response.status === 0) {
		dispatch(setEld(response.result))
		dispatch(toggleIsFetching('eld'))
	}
}
export const addEld = (dataObject: EldType): ThunksType => async (dispatch) => {
	let eldObject = {
		company_id: dataObject.company_id,
		eld_serial_number: dataObject.eld_serial_number,
		eld_note: dataObject.eld_note
	} as EldType

	let response = await eldsAPI.addEld(eldObject)
	if (response.status === 0) {
		showAlert(AlertStatusEnum.Success, 'ELD added successfully')
		dispatch(getEldsFromServer(eldObject.company_id))
	}else {
		showAlert(AlertStatusEnum.Error, 'Failed to add ELD')
	}
}

export const editEld = (dataObject: EldType): ThunksType => async (dispatch) => {
	let eldObject = {
		eld_id: dataObject.eld_id,
		eld_serial_number: dataObject.eld_serial_number,
		eld_note: dataObject.eld_note
	} as EldType

	let response = await eldsAPI.editEld(eldObject)
	if (response.status === 0) {
		showAlert(AlertStatusEnum.Success, 'ELD edited successfully')
		dispatch(getEldsFromServer(dataObject.company_id))
	}else {
		showAlert(AlertStatusEnum.Error, 'Failed to edit ELD')
	}
}

export const deleteEld = (id: number, companyId: number): ThunksType => async (dispatch) => {
	let response = await eldsAPI.deleteEld(id)

	if (response.status === 0) {
		showAlert(AlertStatusEnum.Success, 'ELD deleted successfully')
		dispatch(getEldsFromServer(companyId))
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to delete ELD')
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default eldsReducer;