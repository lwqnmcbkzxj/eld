import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

const SET_PAGE_NAME = 'SET_PAGE_NAME'
const SET_IS_ROOT_PAGE = 'SET_IS_ROOT_PAGE'
const SET_LOGGED = 'SET_LOGGED'

let initialState = {
	pageName: "",
	isRootPage: false,
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetPageNameType | SetIsRootPageType ;

const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_PAGE_NAME: {
			return {
				...state,
				pageName: action.pageName
			}
		}
		case SET_IS_ROOT_PAGE: {
			return {
				...state,
				isRootPage: action.isRootPage
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
	let pagesArray = ['units', 'drivers','vehicles','logs','driving-event','elds','transfer-eld-data', 'dashboard', 'companies', 'plans', 'accounting', 'settings']
	let pathParts = pathname.split('/').slice(1)

	let pageName = ''
	if (pagesArray.some(page => page === pathParts[0])) 
		pageName = pathParts[0][0].toUpperCase() + pathParts[0].slice(1)
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



type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default appReducer;