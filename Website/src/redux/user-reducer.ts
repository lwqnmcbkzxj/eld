import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'

const SET_LOGGED = 'user/SET_LOGGED'

let initialState = {
	logged: false
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetLoggedType;

const userReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_LOGGED: {
			console.log('s')
			return {
				...state,
				logged: action.logged
			}
		}
		default:
			return state;
	}
}


type SetLoggedType = {
	type: typeof SET_LOGGED,
	logged: boolean
}

export const setLogged = (logged: boolean):SetLoggedType => {
	return {
		type: SET_LOGGED,
		logged
	}
}

export const login = (login: string, password: string): ThunksType => async (dispatch) => {
	dispatch(setLogged(true))
}

export const logout = ():ThunksType => async (dispatch) => {
	dispatch(setLogged(false))
}


type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export default userReducer;