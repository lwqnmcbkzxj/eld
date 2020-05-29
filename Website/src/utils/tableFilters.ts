type Order = 'asc' | 'desc';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	let aStr = a[orderBy] as unknown as string
	let bStr = b[orderBy] as unknown as string

	if (typeof aStr === 'boolean') return 0

	if (!!(+aStr) || (+aStr) === 0 || (+bStr) === 0) {
		let aNum = a[orderBy] as unknown as number
		let bNum = b[orderBy] as unknown as number

		if (bNum < aNum) {
			return -1;
		}
		if (bNum > aNum) {
			return 1;
		}

	} else {
		aStr = aStr.toLowerCase()
		bStr = bStr.toLowerCase()

		if (bStr < aStr) {
			return -1;
		}
		if (bStr > aStr) {
			return 1;
		}
	}

	return 0;
}

export function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}