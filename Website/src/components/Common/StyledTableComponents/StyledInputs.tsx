import React, { FC, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { FormControl, FilledInput, InputAdornment, TextField } from '@material-ui/core'
import { colors } from '../../../assets/scss/Colors/Colors'

import searchIcon from '../../../assets/img/pctg_search.svg'


export const useInputStyles = makeStyles(theme => ({
	seacth_input: {
		borderBottom: `1px solid ${colors.bg_component_color}`,
		backgroundColor: colors.bg_component_color,
		height: '32px',
		padding: '5px 12px 6px 12px',
		borderRadius: '4px',
		"&:before": {
			borderBottom: `1px solid ${colors.bg_component_color}`,
		},
		"&:hover": {
			backgroundColor: colors.bg_component_color
		},
		"& input": {
			padding: 0
		},
		"& .input__icon": {
			filter: 'invert(16%) sepia(4%) saturate(602%) hue-rotate(236deg) brightness(93%) contrast(89%)'
		},
	}
}))

type SearchInputTypes = {
	searchText: string
	setSearchText: (searchText: string) => void
}

export const StyledSearchInput: FC<SearchInputTypes> = ({ searchText, setSearchText, ...props }) => {
	const classes = useInputStyles()

	return (
		<FormControl >
			<FilledInput
				className={classes.seacth_input}
				margin="dense"
				placeholder="Search"
				value={searchText}
				onChange={(e) => { setSearchText(e.target.value) }}
				startAdornment={<InputAdornment position="start"> <img src={searchIcon} alt="search-icon" className="input__icon" /> </InputAdornment>}
			/>
		</FormControl>
	);
};
