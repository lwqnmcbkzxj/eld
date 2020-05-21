export const isContainsSearchText = (searchText, dataElement, keysObject) => {
	for (let key of keysObject) {
		if (dataElement[key].toString().toLowerCase().includes(searchText.toLowerCase())) {
			return true
		}

	}
	return false
}