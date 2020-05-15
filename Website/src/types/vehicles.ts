import { StatusType } from './types'

export type VehicleType = {
	id: number
	truckNumber: string
	make: string
	model: string
	license: string
	eldNumber: string
	notes: string
	status: StatusType
}