import { StatusType, StatusEnum } from './types'

export type DriverType = {
	user_id: number,
	user_first_name: string,
	user_last_name: string,
	user_full_name: string,
	user_login: string,
	user_phone: string,
	vehicle_truck_number: string | number,
	user_notes: string,
	user_status: StatusEnum,
	app_version: string,
	device_version: string
}