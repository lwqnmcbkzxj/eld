import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

const SET_PAGE_NAME = 'app/SET_PAGE_NAME'
const SET_IS_ROOT_PAGE = 'app/SET_IS_ROOT_PAGE'
const SET_PAGE_URL = 'app/SET_PAGE_URL'

const TOGGLE_IS_FETCHING = 'app/TOGGLE_IS_FETCHING'

let initialState = {
	pageUrl: "",
	pageName: "",
	isRootPage: false,
	isFetchingArray: [] as Array<string>
}

type InitialStateType = typeof initialState;
type ActionsTypes =
	SetPageNameType |
	SetIsRootPageType |
	SetPageURLType |
	ToggleIsFetchingType;

const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_PAGE_NAME: {
			return {
				...state,
				pageName: action.pageName
			}
		}
		case SET_PAGE_URL: {
			return {
				...state,
				pageUrl: action.pageUrl
			}
		}
		case SET_IS_ROOT_PAGE: {
			return {
				...state,
				isRootPage: action.isRootPage
			}
		}		
		case TOGGLE_IS_FETCHING: {
			let fetchingArray = initialState.isFetchingArray
			let elemIndex = fetchingArray.indexOf(action.instanceName)

			if (elemIndex === -1) {
				fetchingArray.push(action.instanceName)
			} else {
				fetchingArray.splice(elemIndex, 1)
			}
			
			return {
				...state,
				isFetchingArray: [...fetchingArray]
			}
		}
		
		default:
			return state;
	}
}

type SetPageNameType = {
	type: typeof SET_PAGE_NAME,
	pageName: string
}
type SetIsRootPageType = {
	type: typeof SET_IS_ROOT_PAGE,
	isRootPage: boolean
}
type SetPageURLType = {
	type: typeof SET_PAGE_URL,
	pageUrl: string
}
export type ToggleIsFetchingType = {
	type: typeof TOGGLE_IS_FETCHING,
	instanceName: string
}

export const setPageURL = (pageUrl: string):SetPageURLType => {
	return {
		type: SET_PAGE_URL,
		pageUrl
	}
}
export const setPageName = (pageName: string):SetPageNameType => {
	return {
		type: SET_PAGE_NAME,
		pageName
	}
}
export const setIsRootPage = (isRootPage: boolean):SetIsRootPageType => {
	return {
		type: SET_IS_ROOT_PAGE,
		isRootPage
	}
}

export const getPageName = (pathname: string): ThunksType => async (dispatch) => {
	let pagesArray = ['units', 'drivers','vehicles','trips','logs','driving-event','elds','transfer-eld-data', 'dashboard', 'companies', 'plans', 'accounting', 'settings']
	let pathParts = pathname.split('/').slice(1)
	

	dispatch(setPageURL(pathParts[0]))
	let pageName = ''
	if (pagesArray.some(page => page === pathParts[0])) 
		pageName = pathParts[0][0].toUpperCase() + pathParts[0].slice(1)
	else if (pathParts[0] === 'login') 
		return
	else if (pathParts[0] === '') 
		pageName = 'Simply ELD'
	else 
		pageName = 'Not found' 	 
	
	if (pageName.includes('-'))
		pageName = pageName.split('-').join(' ')
	
	dispatch(setPageName(pageName))
	
	if (pathParts.length > 1 && pageName !== 'Not found') 
		dispatch(setIsRootPage(false) )
	else 
		dispatch(setIsRootPage(true))
		
}

export const toggleIsFetching = (instanceName: string):ToggleIsFetchingType => {
	return {
		type: TOGGLE_IS_FETCHING,
		instanceName
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default appReducer;