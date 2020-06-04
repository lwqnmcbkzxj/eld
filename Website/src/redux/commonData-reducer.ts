import { AppStateType, SelectorType, StatusEnum } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { VehicleType } from '../types/vehicles'

import { ToggleIsFetchingType, toggleIsFetching } from './app-reducer'
import { vehiclesAPI, appAPI } from '../api/api'
import { ResultCodesEnum } from '../api/types'

const SET_TIMEZONES = 'common/SET_TIMEZONES'
const SET_STATES = 'common/SET_STATES'
const SET_FUEL_TYPES = 'common/SET_FUEL_TYPES'
const SET_YEARS = 'common/SET_YEARS'
const SET_TERMINALS = 'common/SET_TERMINALS'

let initialState = {
	fuelTypes: [] as Array<SelectorType>,
	timezones: [] as Array<SelectorType>,
	states: [] as Array<SelectorType>,
	years: [] as Array<SelectorType>,
	terminals: [] as Array<SelectorType>, 

}

type InitialStateType = typeof initialState;
type ActionsTypes =
	ToggleIsFetchingType |
	SetTimezonesType |
	SetStatesType |
	SetFuelTypesType |
	SetTerminalsType |
	SetYearsType;

const commonDataReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_TIMEZONES: {
			let timezonesArr = [] as Array<SelectorType>
			action.timezones.map(timezone => {
				timezonesArr.push({ id: timezone.timezone_id, value: timezone.timezone_name })
			})

			return {
				...state,
				timezones: timezonesArr
			}
		}
		case SET_FUEL_TYPES: {
			let fuelTypesArr = [] as Array<SelectorType>
			action.fuelTypes.map(fuelType => {
				let fueTypeVal = fuelType[0] + fuelType.slice(1).toLowerCase()
				fuelTypesArr.push({ id: fuelType, value: fueTypeVal })
			})

			return {
				...state,
				fuelTypes: fuelTypesArr
			}
		}
		case SET_STATES: {
			let statesArr = [] as Array<SelectorType>
			action.states.map(state => {
				statesArr.push({ id: state.issuing_state_id, value: state.issuing_state_name })
			})

			return {
				...state,
				states: statesArr
			}
		}
		case SET_YEARS: {
			let currentYear = new Date().getFullYear()
			let yearsArr = [] as Array<SelectorType>
			for (let i = currentYear; i > currentYear - 30; i--) {
				yearsArr.push({ value: i.toString(), id: i })
			}
			return {
				...state,
				years: yearsArr
			}
		}
		case SET_TERMINALS: {
			let terminalsArr = [] as Array<SelectorType>
			action.terminals.map(terminal => {
				terminalsArr.push({ id: terminal.company_address_id, value: terminal.company_address_text })
			})

			return {
				...state,
				terminals: terminalsArr
			}
		}
			
		default:
			return state;
	}
}



type TimezoneType = {
	timezone_id: number
	timezone_name: string
}

type StateType = {
	issuing_state_id: number
	issuing_state_name: string
}
type TerminalType = {
	company_address_id: number,
	company_address_text: string,
	company_address_type: string,
	company_address_status: StatusEnum
}
// ----------------------------------
type SetTimezonesType = {
	type: typeof SET_TIMEZONES,
	timezones: Array<TimezoneType>
}
type SetStatesType = {
	type: typeof SET_STATES,
	states: Array<StateType>
}
type SetFuelTypesType = {
	type: typeof SET_FUEL_TYPES,
	fuelTypes: Array<string>
}
type SetYearsType = {
	type: typeof SET_YEARS
}
type SetTerminalsType = {
	type: typeof SET_TERMINALS,
	terminals: Array<TerminalType>
}
// ----------------------------------

const setTimezones = (timezones: Array<TimezoneType>): SetTimezonesType => {
	return {
		type: SET_TIMEZONES,
		timezones
	}
}
const setStates = (states: Array<StateType>): SetStatesType => {
	return {
		type: SET_STATES,
		states
	}
}
const setFuelTypes = (fuelTypes: Array<string>): SetFuelTypesType => {
	return {
		type: SET_FUEL_TYPES,
		fuelTypes
	}
}
const setTerminals = (terminals: Array<TerminalType>): SetTerminalsType => {
	return {
		type: SET_TERMINALS,
		terminals
	}
}

export const getYears = (): ThunksType => async (dispatch) => {
	if (initialState.years.length === 0) {
		dispatch({
			type: SET_YEARS
		})
	}
}

export const getFuelTypes = (): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('fuel-types'))
	let response = await appAPI.getFuelTypes()

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('fuel-types'))
		dispatch(setFuelTypes(response.result))
	}
}
export const getTimezones = (): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('timezones'))
	let response = await appAPI.getTimezones()

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('timezones'))
		dispatch(setTimezones(response.result))
	}
}

export const getStates = (): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('states'))
	let response = await appAPI.getStates()

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('states'))
		dispatch(setStates(response.result))
	}
}
export const getCompanyTerminals = (comapnyId: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('terminals'))
	let response = await appAPI.getTerminals(comapnyId)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('terminals'))
		dispatch(setTerminals(response.result))
	}
}






type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default commonDataReducer;