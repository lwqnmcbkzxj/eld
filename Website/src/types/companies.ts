import { StatusEnum } from './types'

export type CompanyType = {
	// id: number
	// number: number
	// company_name: string
	// contact_name: string
	// contact_phone: string
	// active_units: string
	// subscribe_type: string
	// current_balance: string
	// status: string

	// company_address: string
	// company_timezone: string
	// usdot: string
	// email: string
	// terminal_adresses: Array<string>



	company_id: number,
	company_short_name: string
	company_long_name: string
	company_main_office_address: string
	company_home_terminal_address: string
	company_subscribe_type: string,
	timezone_id: number | number,
	company_contact_name: string,
	company_contact_phone: string,
	company_email: string,
	company_usdot: number,
	company_sort: number,
	company_status: StatusEnum
	user_id: number,
	user_role_id: number
	terminal_addresses: Array<any>
}