import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { CompanyType } from '../types/companies'

const SET_COMPANIES = 'SET_COMPANIES'
			
let initialState = {
	companies: [
		{
			id: 1,
			number: 1,
			company_name: "FedEx",
			contact_name: "Donald Duck",
			contact_phone: "+1 (302) 894-6596",
			active_units: "578",
			subscribe_type: "Basic",
			current_balance: "$10 000",
			status: {
				text: 'active',
				type: 'success',

			},
			company_address: 'asdasdasdasd',
			company_timezone: 'asdasdasd',
			email: 'asdasd@sadasd.sadasd',
			usdot: '123213213',
			terminal_adresses: ['1hjasdgasjd', '2asdasdad'],
		},
		{
			id: 2,
			number: 2,
			company_name: "FedEx",
			contact_name: "Donald Duck",
			contact_phone: "+1 (302) 894-6596",
			active_units: "578",
			subscribe_type: "Basic",
			current_balance: "$10 000",
			status: {
				text: 'deactivated',
				type: 'error',

			},
			company_address: 'asdasdasdasd',
			company_timezone: 'asdasdasd',
			email: 'asdasd@sadasd.sadasd',
			usdot: '123213213',
			terminal_adresses: ['1hjasdgasjd', '2asdasdad'],
		}

	] as Array<CompanyType>
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetCompaniesType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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

export const setUnits = (companies: Array<CompanyType>): SetCompaniesType => {
	return {
		type: SET_COMPANIES,
		companies
	}
}

export const getCompaniesFromServer = ():ThunksType => async (dispatch) => {
	console.log('GETTING COMPANIES FROM SERVER')
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;