import { AppStateType } from '../types/types'
import { ThunkAction } from 'redux-thunk'
import { UserType } from '../types/user'
import Cookies from "js-cookie";
import { userAPI } from '../api/api';

const SET_LOGGED = 'user/SET_LOGGED'
const SET_USER_INFO = 'user/SET_USER_INFO'

let initialState = {
	logged: false,
	userInfo: { } as UserType
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetLoggedType | SetUserInfoType;

const userReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
	switch (action.type) {
		case SET_LOGGED: {
			return {
				...state,
				logged: action.logged
			}
		}
		case SET_USER_INFO: {
			return {
				...state,
				userInfo: {...action.userInfo}
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
type SetUserInfoType = {
	type: typeof SET_USER_INFO,
	userInfo: any
}
type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>


export const setLogged = (logged: boolean):SetLoggedType => {
	return {
		type: SET_LOGGED,
		logged
	}
}
export const setUserInfo = (userInfo: any):SetUserInfoType => {
	return {
		type: SET_USER_INFO,
		userInfo
	}
}




export const login = (login: string, password: string): ThunksType => async (dispatch) => {
	// let response = userAPI.login(login, password)

	dispatch(setLogged(true))
	// dispatch(setUserInfo({}))
	if (login === 'admin') {
		dispatch(setUserInfo({role: 1}))
	} else {
		dispatch(setUserInfo({role: 0}))
	}
}

export const logout = (): ThunksType => async (dispatch) => {
	dispatch(setLogged(false))
	// dispatch(setAccessToken(""))
	dispatch(setUserInfo({}))
	Cookies.remove('access-token')
}

export const getUserInfo = (): ThunksType => async (dispatch) => {
	// let response = await userAPI.getUserInfo()
	// if (!response.message) {
		// dispatch(setUserInfo(response))
	// }
}
export const authUser = (): ThunksType => async (dispatch) => {
	let token = Cookies.get('access-token');
	
	if (token) {
		// dispatch(setAccessToken(token))
		dispatch(getUserInfo())
		dispatch(setLogged(true))
	}
}


export default userReducer;