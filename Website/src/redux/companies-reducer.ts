import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { CompanyType } from '../types/companies'
import { toggleIsFetching, ToggleIsFetchingType } from './app-reducer'
import { ResultCodesEnum } from '../api/types'
import { companiesAPI } from '../api/api'

const SET_COMPANIES = 'SET_COMPANIES'
			
let initialState = {
	companies: [] as Array<CompanyType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetCompaniesType | ToggleIsFetchingType;

const companiesReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_COMPANIES: {
			return {
				...state,
				companies: [...action.companies]
			}
		}
		default:
			return state;
	}
}

type SetCompaniesType = {
	type: typeof SET_COMPANIES,
	companies: Array<CompanyType>
}

export const setComapnies = (companies: Array<CompanyType>): SetCompaniesType => {
	return {
		type: SET_COMPANIES,
		companies
	}
}

export const getCompaniesFromServer = ():ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('companies'))
	let response = await companiesAPI.getCompanies()

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('companies'))
		dispatch(setComapnies(response.result))
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default companiesReducer;