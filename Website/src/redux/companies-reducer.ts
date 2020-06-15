import { AppStateType, AlertStatusEnum, PasswordObjectType, StatusEnum } from '../types/types'
import { ThunkAction } from 'redux-thunk'

import { CompanyType } from '../types/companies'
import { toggleIsFetching, ToggleIsFetchingType } from './app-reducer'
import { ResultCodesEnum } from '../api/types'
import { companiesAPI, userAPI } from '../api/api'
import { showAlert } from '../utils/showAlert'

const SET_COMPANIES = 'companies/SET_COMPANIES'
const SET_COMPANY = 'companies/SET_COMPANY'
			
let initialState = {
	companies: [] as Array<CompanyType>,
	currentCompany: {} as CompanyType
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetCompaniesType | SetCompanyType | ToggleIsFetchingType;

const companiesReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_COMPANIES: {
			return {
				...state,
				companies: [...action.companies.filter(company => company.company_status !== StatusEnum.DELETED)]
			}
		}
		case SET_COMPANY: {
			return {
				...state, 
				currentCompany: {...action.company}
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
type SetCompanyType = {
	type: typeof SET_COMPANY,
	company: CompanyType
}

export const setComapnies = (companies: Array<CompanyType>): SetCompaniesType => {
	return {
		type: SET_COMPANIES,
		companies
	}
}
export const setCompany = (company: CompanyType): SetCompanyType => {
	return {
		type: SET_COMPANY,
		company
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

export const getCompanyFromServer = (id: number):ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('company'))
	let response = await companiesAPI.getCompany(id)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(setCompany(response.result))
		dispatch(toggleIsFetching('company'))
	}
}

 
export const changeCompanyPassword = (userId: number, passwordObject: PasswordObjectType): ThunksType => async (dispatch) => {
	let response = await userAPI.changePassword(passwordObject, userId)

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, 'Password changed successfully')
		dispatch(getCompaniesFromServer())
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to change password')
	}
}


export const addCompany = (company: CompanyType): ThunksType => async (dispatch) => {
	let response = await companiesAPI.addCompany(company)

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, 'Company added successfully')
		dispatch(getCompaniesFromServer())
	} else {

		if (response.status === ResultCodesEnum.ExistsEmail)
			showAlert(AlertStatusEnum.Error, 'Company with that email already exists')
		else 
			showAlert(AlertStatusEnum.Error, 'Failed to add company')
	}
}
export const editCompany = (company: CompanyType, alertVisilbe = true): ThunksType => async (dispatch) => {
	let response = await companiesAPI.editCompany(company)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(getCompaniesFromServer())

		if (alertVisilbe)
			showAlert(AlertStatusEnum.Success, 'Company edited successfully')
	} else {
		if (alertVisilbe)
			showAlert(AlertStatusEnum.Error, 'Failed to edit company')
	}
} 
export const deleteCompany = (id: number): ThunksType => async (dispatch) => {
	let response = await companiesAPI.deleteCompany(id)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(getCompaniesFromServer())

		showAlert(AlertStatusEnum.Success, 'Company deleted successfully')
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to delete company')
	}
} 

export const toggleCompanyActivation = (companyId: number, status: StatusEnum): ThunksType => async (dispatch) => {
	let response
	if (status === StatusEnum.DEACTIVATED) {
		response = await companiesAPI.activateCompany(companyId)
	} else {
		response = await companiesAPI.deactivateCompany(companyId)
	}

	let statusText = status === StatusEnum.DEACTIVATED ? 'activate' : 'deactivate'

	if (response.status === ResultCodesEnum.Success) {
		showAlert(AlertStatusEnum.Success, `Company ${statusText}d successfully`)
		dispatch(getCompaniesFromServer())
	} else {
		showAlert(AlertStatusEnum.Error, `Failed to ${statusText} company`)
	}
}
type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default companiesReducer;