import { UserType } from '../types/user'

export enum ResultCodesEnum {
	Success = 0,
	Error = 1,
	ExistsLogin = 4,
	ExistsEmail = 6,
}

export type defaultServerResponse = {
	result: {} | string
	status: ResultCodesEnum 
}

export type GetUserInfoResponseType = defaultServerResponse & {
	result: UserType
}