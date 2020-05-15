import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { UnitType } from '../types/units'

const SET_UNITS = 'SET_UNITS'

let initialState = {
	units: [
		{
			id: 1,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'Driving',
				type: 'success'
			},
			description: 'Pick up',
			currentSPD: 60.5,
		},
		{
			id: 2,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 3,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 4,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 5,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},

		{
			id: 6,
			name: 'Bruce Wayne ',
			truckNumber: '0332',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},{
			id: 7,
			name: 'Brqquce Waycne ',
			truckNumber: '0132',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 8,
			name: 'Brudxcce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 9,
			name: 'Bsruce Wayne ',
			truckNumber: '0342',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 10,
			name: 'Bruacex Wa2yne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 11,
			name: 'Bruceq Wayane ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 12,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
		{
			id: 13,
			name: 'Bruce Wayne ',
			truckNumber: '032',
			lastLocation: '15.6 mi WNW of Lake Forest, CA',
			share: '',
			date: '08.12.20  11:30 AM',
			status: {
				text: 'On duty',
				type: 'warning'
			},
			description: 'Pick up',
			currentSPD: 0,
		},
	] as Array<UnitType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetUnitsType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_UNITS: {
			return {
				...state,
				units: [...action.units]
			}
		}
		default:
			return state;
	}
}

type SetUnitsType = {
	type: typeof SET_UNITS,
	units: Array<UnitType>
}

export const setUnits = (units: Array<UnitType>): SetUnitsType => {
	return {
		type: SET_UNITS,
		units
	}
}

export const getUnitsFromServer = ():ThunksType => async (dispatch) => {
	console.log('GETTING UNITS FROM SERVER')
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;