import { RootReducerType } from '../redux/redux-store'

export type AppStateType = ReturnType<RootReducerType>
export const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export type StatusType = {
	text: string
	type: string
}


export enum StatusEnum {
	Deactivated = 'DEACTIVATED',

	ACTIVE = 'ACTIVE',
	BUSY = 'BUSY',
	DELETED = 'DELETED',
	DEACTIVATED = 'DEACTIVATED',

	OFF_DUTY = 'OFF_DUTY',
	DRIVING = 'DRIVING',
	ON_DUTY = 'ON_DUTY',
	SLEEPER = 'SLEEPER',
	ON_DUTY_YM = 'ON_DUTY_YM',
	OFF_DUTY_PC = 'OFF_DUTY_PC',
	BREAK = 'BREAK',

	HAS_DEFECTS = 'HAS_DEFECTS',
	NO_DEFECTS = 'NO_DEFECTS',


}

export enum AlertStatusEnum {
	Success = 'success',
	Error = 'error',
	Warn = 'warn'
}



export type PasswordObjectType = {
	old_password: string
	new_password: string
	new_password_confirmation: string
}

export type LabelType = {
	name: string
	label: string
	align?: "inherit" | "left" | "center" | "right" | "justify" | undefined
	notSortable?: boolean
}

export enum FuelTypeEnum {
	'DIESEL',
	'GASOLINE',
	'PROPANE',
	'LIQUID NATURAL GAS',
	'COMPRESSED NATURAL GAS',
	'ETHANOL'
}


export type SelectorType = {
	value: string
	id: number | string
}