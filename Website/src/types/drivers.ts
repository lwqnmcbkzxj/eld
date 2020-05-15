import { StatusType } from './types'

export type DriverType = {
	id: number
		firstName: string
		lastName: string
		userName: string
		phone: string
		truckNumber: string
		notes: string
		appVersion: string
		appVersionStatus: string
		deviceVersion: string
		status: StatusType
}