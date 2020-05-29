import { RootReducerType } from '../redux/redux-store'

export type AppStateType = ReturnType<RootReducerType>
export const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export type StatusType = {
	text: string
	type: string
}


export enum StatusEnum {
	Active = 'ACTIVE',
	Deactivated = 'DEACTiVATED',
	// Active = 'ACTIVE',
	// Active = 'ACTIVE',
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