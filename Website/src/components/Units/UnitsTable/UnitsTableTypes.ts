import { StatusType } from '../../../types/types'

export type EnhancedTableToolbarProps = {
	numSelected: number
	selected: string[]
	deleteItem: (id: number) => void

	searchText: string
	setSearchText: (searchText: string) => void
	getUnits: () => void
}


export type EnhancedTableHeadProps = {
	numSelected: number
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
	rowCount: number
}

export type EnhancedTableProps = {
	rows: Array<{
		id: number
		name: string
		truckNumber: string
		lastLocation: string
		share: any
		date: string
		status: StatusType
		description: string
		currentSPD: number
	}>
	getUnits: () => void
}