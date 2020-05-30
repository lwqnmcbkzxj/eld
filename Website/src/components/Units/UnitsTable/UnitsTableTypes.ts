import { StatusType, LabelType } from '../../../types/types'

export type EnhancedTableToolbarProps = {
	numSelected: number
	selected: string[]
	deleteItem: (id: number) => void

	searchText: string
	setSearchText: (searchText: string) => void
	getUnits: () => void

	toggleTable?: () => void
	tableVisible?: boolean
}

type Order = 'asc' | 'desc';

export type EnhancedTableHeadProps = {
	numSelected: number
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
	rowCount: number
	labels: Array<LabelType>
	onRequestSort?: (event: React.MouseEvent<unknown>, property: string) => void;
	order?: Order;
	orderBy?: string;
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

	toggleTable?: () => void
	tableVisible?: boolean
}