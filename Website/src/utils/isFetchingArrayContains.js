export const isFetchingArrContains = (fetchingArray, comparingArray) => {
	for (let i = 0; i < comparingArray.length; i++) {
		if (fetchingArray.includes(comparingArray[i])) {
			return true
			break
		} 
	}
	return false
}