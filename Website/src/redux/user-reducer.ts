import { AppStateType, AlertStatusEnum, PasswordObjectType } from '../types/types'
import { ThunkAction } from 'redux-thunk'
import { UserType } from '../types/user'
import Cookies from "js-cookie";
import { setTokenForAPI, userAPI } from '../api/api';
import { ResultCodesEnum, GetUserInfoResponseType } from '../api/types'
import { showAlert } from '../utils/showAlert';

const SET_LOGGED = 'user/SET_LOGGED'
const SET_USER_INFO = 'user/SET_USER_INFO'
const SET_TOKEN = 'user/SET_TOKEN'

let initialState = {
	logged: false,
	userInfo: { } as UserType,
	token: "" as string
}

type InitialStateType = typeof initialState;
type ActionsTypes = SetLoggedType | SetUserInfoType | SetTokenType;

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
				userInfo: {
					...state.userInfo,
					...action.userInfo
				}
			}
		}
		case SET_TOKEN: {
			return {
				...state,
				token: action.token
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
	userInfo: UserType
}

type SetTokenType = {
	type: typeof SET_TOKEN
	token: string
}

type ThunksType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>


export const setLogged = (logged: boolean): SetLoggedType => {
	return {
		type: SET_LOGGED,
		logged
	}
}
export const setUserInfo = (userInfo: any): SetUserInfoType => {
	return {
		type: SET_USER_INFO,
		userInfo
	}
}



export const login = (login: string, password: string): ThunksType => async (dispatch) => {
	let response = await userAPI.login(login, password) as GetUserInfoResponseType

	if (response && response.status === ResultCodesEnum.Success) {


		// dispatch(setLogged(true))
		// dispatch(setAccessToken(response.result.token))
		// await dispatch(getUserInfo( response.result.user_id))

		Cookies.set('token', response.result.token, { expires: 1 / 24 });
		Cookies.set('user_id', response.result.user_id.toString(), { expires: 1 / 24 });

		dispatch(authUser())
	} else {
		showAlert('error', 'Failed to login')
	}
}

export const logout = (): ThunksType => async (dispatch) => {
	dispatch(setLogged(false))
		dispatch(setAccessToken(""))
		dispatch(setUserInfo({}))
		Cookies.remove('token')
		Cookies.remove('user_id')
	let response = await userAPI.logout()

	// if (response.status === 0) {
		// dispatch(setLogged(false))
		// dispatch(setAccessToken(""))
		// dispatch(setUserInfo({}))
		// Cookies.remove('token')
		// Cookies.remove('user_id')
	// } else {

	// }
}

export const getUserInfo = (userId: number): ThunksType => async (dispatch) => {
	let response = await userAPI.getUserInfo(userId)
	if (response.status === ResultCodesEnum.Success) {
		dispatch(setUserInfo(response.result))
	}
}
export const authUser = (): ThunksType => async (dispatch) => {
	let token = Cookies.get('token');
	let userId = Cookies.get('user_id');

	if (token && userId) {
		dispatch(setLogged(true))
		dispatch(setAccessToken(token))
		await dispatch(getUserInfo(+userId))
	}
}

export const changePassword = (passwordObj: PasswordObjectType): ThunksType => async (dispatch) => {
	let response = await userAPI.changePassword(passwordObj)

	if (response.status === 0) {
		showAlert(AlertStatusEnum.Success, 'Password changed successfully')
	} else {
		showAlert(AlertStatusEnum.Error, 'Failed to change password')
	}
}
export const editProfile = (editProfile: UserType): ThunksType => async (dispatch) => {
	// let response = userAPI.changePassword()

	// if (response.status === 0) {

	// } else {
	// 	showAlert(AlertStatusEnum.Error, 'Failed to change profile')
	// }
}


const setAccessToken = (token: string): ThunksType => async (dispatch) => {
	setTokenForAPI(token)

	dispatch({
		type: SET_TOKEN,
		token
	})
}


export default userReducer;