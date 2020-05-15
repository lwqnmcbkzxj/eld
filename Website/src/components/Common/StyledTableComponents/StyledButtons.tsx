import React, { FC, useState } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { colors } from '../../../assets/scss/Colors/Colors'


export const StyledDefaultButton = withStyles((theme) => ({
	root: {
		color: colors.primary_text_color,
		fontSize: '14px',
		lineHeight: '21px',
		background: '#fff',
		border: '1px solid rgba(50, 48, 51, 0.15)',
		boxSizing: 'border-box',
		borderRadius: '2px',
		fontFamily: 'Heebo Medium',
		textTransform: 'none',
		width: '128px',
	}
}))(Button);