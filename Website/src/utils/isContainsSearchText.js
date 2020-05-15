export const isContainsSearchText = (searchText, dataElement, keysObject) => {
	for (let key of keysObject) {
		if (dataElement[key].toLowerCase().includes(searchText.toLowerCase())) {
			return true
		}
	}
	return false
}