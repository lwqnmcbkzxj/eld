import { StatusType } from './types'

export type CompanyType = {
	id: number
	number: number
	company_name: string
	contact_name: string
	contact_phone: string
	active_units: string
	subscribe_type: string
	current_balance: string
	status: StatusType

	company_address: string
	company_timezone: string
	usdot: string
	email: string
	terminal_adresses: Array<string>
}