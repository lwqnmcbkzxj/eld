import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { VehicleType } from '../types/vehicles'

const SET_VEHICLES = 'SET_VEHICLES'

let initialState = {
	vehicles: [
		{
			id: 1,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'active',
				type: 'success'
			},
		},
		{
			id: 2,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 3,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 4,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 5,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 6,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 7,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 8,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 9,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 10,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 11,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 12,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 13,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 14,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 15,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 16,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		},
		{
			id: 17,
			truckNumber: '032',
			make: 'Freightliner',
			model: 'Cascadia (2016)',
			license: 'P918297',
			eldNumber: 'Vehicle-032-2B250D69',
			notes: 'Notes notes',
			status: {
				text: 'deactivated',
				type: 'error'
			},
		}

	]as Array<VehicleType>
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

export const getVehiclesFromServer = ():ThunksType => async (dispatch) => {
	console.log('GETTING VEHICLES FROM SERVER')
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;