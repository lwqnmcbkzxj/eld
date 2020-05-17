
import React from 'react';

import { DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from './ModalsStyle'

import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../StyledTableComponents/StyledButtons';

import * as yup from "yup";



type DialogActionsType = {
	isSubmitting: boolean
	handleClose: () => void
	submitText: string
	style?: any
}

export const CustomDialogActions = ({ isSubmitting, handleClose, submitText = "", style={}, ...props }: DialogActionsType) => {
	const classes = useStyles();


	return (
		<DialogActions className={classes.dialog__actions} style={style}>
			<StyledDefaultButtonSmall onClick={handleClose}	>Cancel</StyledDefaultButtonSmall>

			<StyledConfirmButtonSmall disabled={isSubmitting} type="submit">{submitText}</StyledConfirmButtonSmall>
		</DialogActions>
	);
}