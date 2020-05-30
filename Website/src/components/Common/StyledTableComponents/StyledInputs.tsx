import React, { FC, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core'
import { FormControl,  InputAdornment, TextField, InputBase, InputLabel, createStyles } from '@material-ui/core'
import { colors } from '../../../assets/scss/Colors/Colors'

import searchIcon from '../../../assets/img/pctg_search.svg'


const inputStyle = {
	root: {
		"& .MuiInputBase-root": {
			borderBottom: `1px solid ${colors.bg_component_color}`,
			backgroundColor: colors.bg_component_color,
			borderRadius: '4px',
			fontSize: '14px',
			lineHeight: '21px',
			color: colors.primary_text_color,
			height: '44px',
			padding: '0px',

			"&.MuiInput-multiline": {
				minHeight: '139px',
				overflowY: 'auto',
				"&:after": {
					borderBottom: `none!important`,
				},

				"& textarea": {
					padding: '10px 12px',
					boxSizing: 'border-box',
					minHeight: '138px',
				},
			},


			"&:before": {
				borderBottom: `1px solid ${colors.bg_component_color}`,
			},
			"&:hover": {
				"&:before": {
					borderBottom: `1px solid ${colors.bg_component_color}`,
				}
			},
			"& input": {
				padding: '0 12px',
				height: '44px'
			},

			"&::-webkit-input-placeholder": {
				color: colors.placholder_text_color
			},
			"& .MuiInputAdornment-filled": {
				margin: '0!important',
				marginLeft: '8px!important'
			},
		},
		"& .MuiFormHelperText-root": {
			textAlign: 'right',
			"&.Mui-error": {
				textAlign: 'left'
			}
		}

	},
}

export const StyledFilledInput = withStyles((theme) => (inputStyle))(TextField);

export const StyledFilledInputSmall = withStyles((theme) => ({
	root: {
		"& .MuiInputBase-root": {
			height: '32px',
			"& input": {
				height: '32px'
			},
		}
	},
}))(StyledFilledInput);


// ** SEARCH INPUT START **
type SearchInputTypes = {
	searchText: string
	setSearchText: (searchText: string) => void
}

export const StyledSearchInput: FC<SearchInputTypes> = ({ searchText, setSearchText, ...props }) => {
	const classes = makeStyles(theme => ({
		search_input: {
			"& .input__icon": {
				filter: 'invert(16%) sepia(4%) saturate(602%) hue-rotate(236deg) brightness(93%) contrast(89%)'
			},
			width: '256px',
			margin: '0px',
		}
	}))()

	return (
		<FormControl >
			<StyledFilledInputSmall
				className={classes.search_input}
				margin="dense"
				placeholder="Search"
				variant="filled"
				value={searchText}
				onChange={(e) => { setSearchText(e.target.value) }}
				InputProps={{
					startAdornment: <InputAdornment position="start"><img src={searchIcon} alt="search-icon" className="input__icon" /></InputAdornment>,
				}}

			/>
		</FormControl>
	);
};
// ** SEARCH INPUT END**
