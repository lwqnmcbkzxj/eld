import { StatusType } from './types'

export type UnitType = {
	id: number
	name: string
	truckNumber: string
	lastLocation: string
	share: any
	date: string
	status: StatusType
	description: string
	currentSPD: number
}