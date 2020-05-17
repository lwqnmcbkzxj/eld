import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { Formik, Field, Form, FieldArray } from 'formik';

import { StyledFilledInputSmall } from '../../StyledTableComponents/StyledInputs'

import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";



const ProfileSubscriptionModal = ({ open, handleClose, ...props }: ModalType) => {
	const classes = useStyles();

	const submitSubscription = (data: any, setSubmitting: any) => {
		setSubmitting(true);
		// make async call
		console.log("submit: ", data);
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		
	});

	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={open}
				onClose={handleClose}
				aria-labelledby="subscriotion-dialog-title"
				className={classes.root}
			>
				<DialogTitle id="subscription-dialog-title" className={classes.dialog__header}>Subscription</DialogTitle>

				<Formik
					validateOnChange={true}
					initialValues={{
						
					}}
					validationSchema={validationSchema}
					validate={values => {
						const errors: Record<string, string> = {};
						return errors;
					}}
					onSubmit={(data, { setSubmitting }) => {
						submitSubscription(data, setSubmitting)
					}}
				>

					{({ values, errors, isSubmitting }) => (
						<Form>
							<DialogContent className={classes.dialog__content}>

							</DialogContent>

							
							<CustomDialogActions
								isSubmitting={isSubmitting}
								handleClose={handleClose}
								submitText={"Pay"}
							/>
						</Form>
					)}
				</Formik>
			</Dialog>
		</React.Fragment>
	);
}
export default ProfileSubscriptionModal