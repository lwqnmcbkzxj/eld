import React, { FC, useState } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { colors } from '../../../assets/scss/Colors/Colors'


const CustomButton = withStyles((theme) => ({
	root: {
		fontSize: '14px',
		lineHeight: '21px',
		boxSizing: 'border-box',
		borderRadius: '2px',
		fontFamily: 'Heebo Medium',
		textTransform: 'none',
		width: '128px',
		height: '44px',
	}
}))(Button);

export const StyledDefaultButton = withStyles((theme) => ({
	root: {
		color: colors.primary_text_color,
		background: colors.bg_white_color,
		border: `1px solid ${colors.main_gray_color}`,
		"&:hover": {
			border: `1px solid ${colors.placholder_text_color}`,
			background: colors.bg_white_color,
		},
		"&:active": {
			background: colors.bg_page_color,
			border: `1px solid ${colors.main_gray_color}`,
			color: colors.placholder_text_color
		},
		"&:disabled": {
			border: `1px solid ${colors.main_gray_color}`,
			color: colors.primary_text_color,
		}
	}
}))(CustomButton);

export const StyledDefaultButtonSmall = withStyles((theme) => ({
	root: { height: '32px' }
}))(StyledDefaultButton);








export const StyledConfirmButton = withStyles((theme) => ({
	root: {
		color: colors.bg_white_color,
		background: colors.main_blue_color,
		boxShadow:'0px 2px 3px rgba(20, 66, 143, 0.25)',
		"&:hover": {
			background: '#3376E6',
		},
		"&:active": {
			background: '#125BD3',
		},
		"&:disabled": {
			background: colors.main_gray_color,
			boxShadow:'none',
		}
	}
}))(CustomButton);

export const StyledConfirmButtonSmall = withStyles((theme) => ({
	root: { height: '32px' }
}))(StyledConfirmButton);