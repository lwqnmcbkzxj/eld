import { StatusEnum } from './types'

export type VehicleType = {
	vehicle_id?: number,
	vehicle_truck_number?: string,
	vehicle_make_name?: string
	vehicle_model_name?: string
	vehicle_licence_plate?: string
	eld_serial_number?: string
	vehicle_notes?: string
	vehicle_status?: StatusEnum


	year?: string
	fuel_type?: string
	state?: string
	enter_vin_manually?: boolean
	vin_number?: string

}