import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { EldType } from '../types/elds'

const SET_ELDS = 'SET_ELDS'

let initialState = {
	elds: [
		{
			eldNumber: 'Vehicle-009-2B250D69',
			notes: 'Record is automatically created for the vehicle 009'
		},
		{
			eldNumber: 'Vehicle-009-2B250D69',
			notes: 'Record is automatically created for the vehicle 009'
		},
		{
			eldNumber: 'Vehicle-009-2B250D69',
			notes: 'Record is automatically created for the vehicle 009'
		},
		{
			eldNumber: 'Vehicle-009-2B250D69',
			notes: 'Record is automatically created for the vehicle 009'
		},
		{
			eldNumber: 'Vehicle-009-2B250D69',
			notes: 'Record is automatically created for the vehicle 009'
		},
	] as Array<EldType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetEldsType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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

export const setUnits = (elds: Array<EldType>): SetEldsType => {
	return {
		type: SET_ELDS,
		elds
	}
}

export const getEldsFromServer = ():ThunksType => async (dispatch) => {
	console.log('GETTING DRIVERS FROM SERVER')
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;