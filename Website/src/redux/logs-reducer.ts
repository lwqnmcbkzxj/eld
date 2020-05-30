import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

const SET_SEARCH_TEXT = 'logs/SET_SEARCH_TEXT'

let initialState = {
	searchText: ""
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetSearchText;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		
		case SET_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			}
		}
		default:
			return state;
	}
}

type SetSearchText = {
	type: typeof SET_SEARCH_TEXT,
	searchText: string
}

export const setSearchText = (searchText: string): SetSearchText => {
	return {
		type: SET_SEARCH_TEXT,
		searchText
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;