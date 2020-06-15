import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'
import { toggleIsFetching, ToggleIsFetchingType } from './app-reducer';
import { ResultCodesEnum } from '../api/types';
import { LogsType } from '../types/logs';
import { logsAPI } from '../api/api';

const SET_SEARCH_TEXT = 'logs/SET_SEARCH_TEXT'
const SET_LOGS = 'logs/SET_LOGS'

let initialState = {
	searchText: "",
	logs: [] as Array<LogsType>
}

type InitialStateType = typeof initialState;
type ActionsTypes =
	SetLogsType |
	SetSearchText |
	ToggleIsFetchingType;

const unitsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			}
		}
		case SET_LOGS: {
			return {
				...state,
				logs: action.logs
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
type SetLogsType = {
	type: typeof SET_LOGS,
	logs: Array<LogsType>
}


export const setSearchText = (searchText: string): SetSearchText => {
	return {
		type: SET_SEARCH_TEXT,
		searchText
	}
}

const setLogs = (logs: Array<LogsType>): SetLogsType => {
	return {
		type: SET_LOGS,
		logs
	}
}


export const getLogsFromServer = (date: string, days: number, userId?: number): ThunksType => async (dispatch) => {
	dispatch(toggleIsFetching('logs'))
	let response

	
	response = await logsAPI.getLogs(date, days)

	if (response.status === ResultCodesEnum.Success) {
		dispatch(toggleIsFetching('logs'))
		dispatch(setLogs(response.result))
	}
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default unitsReducer;