import { StatusEnum } from "./types";

export enum RolesEnum {
	user = 1,
	admin = 2,
	company = 3,
}

export type UserType = {
	token: string


	user_id: number,
	user_remark: string,
	user_status: StatusEnum
	user_first_name: string
	user_last_name: string
	user_login: string
	user_email: string
	user_phone: string
	user_driver_licence: string
	issuing_state_id: number
	issuing_state_name: string
	company_id: number
	user_trailer_number: number
	co_driver_id: number,
	role_id: number
	company_address_id: number
	company_address_text: string
	timezone_id: number,
	timezone_name: string,
	user_notes: string,
	user_personal_conveyance_flag: number | boolean
	user_eld_flag: number | boolean
	user_yard_move_flag: number | boolean
	user_manual_drive_flag: number | boolean
	default_vehicle_id: number,
	vehicle_id: number,
	company_contact_name: string
	company_contact_phone:string
}

