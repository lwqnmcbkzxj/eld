import { StatusEnum, StatusType } from './types'

export type VehicleType = {
	vehicle_id: number,
	vehicle_truck_number?: number | string,
	vehicle_make_name?: string
	vehicle_model_name?: string
	vehicle_licence_plate?: string
	eld_serial_number?: number
	vehicle_notes?: string
	vehicle_status: StatusEnum
	vehicle_vin?: string
	company_short_name?: string
	vehicle_issue_year?: number,
	vehicle_fuel_type?: string
	issuing_state_id?: number,
	vehicle_enter_vin_manually_flag: boolean,
	eld_id?: number

}