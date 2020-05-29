import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { DriverType } from '../types/drivers'

const SET_DRIVERS = 'SET_DRIVERS'

let initialState = {
	drivers: [
		{
			id: 1,
			firstName: 'A1ndrew',
			lastName: 'Weas',
			userName: 'andrew',
			phone: '+12345 5623',
			truckNumber: '032',
			notes: 'ABAHS KGDHQJWGJHBs hzjgduiasgduq wgchjz asd as as das',
			appVersion: '2.3.5',
			appVersionStatus: 'success',
			deviceVersion: 'Wireless Link/BL.02.48',
			status: {
				text: 'Active',
				type: 'success'
			}
		},
		{
			id: 2,
			firstName: 'A1ndrew',
			lastName: 'asdasdWeas',
			userName: 'ccccandrew',
			phone: '123+12345 5623',
			truckNumber: 'c032',
			notes: 'hjjABAHS KGDHQJWGJHBs hzjgduiasgduq wgchjz asd as as das',
			appVersion: 'qwds2.3.5',
			appVersionStatus: 'error',
			deviceVersion: 'Wireless Link/BL.02.48',
			status: {
				text: 'Deactivated',
				type: 'error'
			}
		},
	] as Array<DriverType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetDriversType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_DRIVERS: {
			return {
				...state,
				drivers: [...action.drivers]
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

export const setUnits = (drivers: Array<DriverType>): SetDriversType => {
	return {
		type: SET_DRIVERS,
		drivers
	}
}

export const getDriversFromServer = ():ThunksType => async (dispatch) => {
	console.log('GETTING DRIVERS FROM SERVER')
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;