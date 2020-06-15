import { StatusEnum } from './types'

export type LogsType = {
	day: string
	has_inspection: number | boolean
	has_signature: number | boolean | string,
	on_duty_seconds: number
	on_duty_hours: string
	has_records: number | boolean
	distance: number
	has_violation_11h: number | boolean
	has_violation_14h: number | boolean
	has_violation_70h: number | boolean

	has_violation_all: number | boolean | string
	has_shipping_doc: number | boolean
}

export type RecordType = {
	// record_id?: number,
	// record_type?: StatusEnum,
	// record_sub_type?: number,
	// record_location?: string,
	// record_remark?: string,
	// record_start_dt?: string,
	// record_end_dt?: string


	number: any
	status: any
	time: any
	duration: any
	location: any
	odometer: any
	eng_hours: any
	note: any

}