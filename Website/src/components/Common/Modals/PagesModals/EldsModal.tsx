import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { colors } from '../../../../assets/scss/Colors/Colors';
import { Formik, Field, Form, FieldArray } from 'formik';
import { CustomField, CustomTextArea } from '../../FormComponents/FormComponents';

import { StyledFilledInputSmall } from '../../../Common/StyledTableComponents/StyledInputs'

import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';

import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";
import { EldType } from '../../../../types/elds';


type EldModalType = {
	initialValues: {
		id?: number
		serial_number?: string
		notes?: string
	}
	titleText: string
}


const EditProfileModal = ({ open, handleClose, initialValues, titleText, ...props }: ModalType & EldModalType) => {
	const classes = useStyles();

	const handleSubmit = (data: any, setSubmitting: any) => {
		setSubmitting(true);
		// make async call
		console.log("submit: ", data);
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		serial_number: yup.string().required(),
		notes: yup.string(),

	});
console.log(initialValues)

	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-profile-dialog-title"
				className={classes.root}
			>
				<DialogTitle id="edit-profile-dialog-title" className={classes.dialog__header}>
					{titleText}

					{ initialValues.id && 
					<StyledDefaultButtonSmall
						onClick={() => {
							console.log('deleting ' + initialValues.id);
							handleClose()
						}}
					>Delete</StyledDefaultButtonSmall> } 
				</DialogTitle>

				<Formik
					validateOnChange={true}
					initialValues={initialValues}
					validationSchema={validationSchema}
					validate={values => {
						const errors: Record<string, string> = {};
						return errors;
					}}
					onSubmit={(data, { setSubmitting }) => {
						handleSubmit(data, setSubmitting)
					}}
				>

					{({ values, errors, isSubmitting }) => (
						<Form>
							<DialogContent className={classes.dialog__content}>

								<CustomField name={'serial_number'} label={'Serial No.'} />
								<CustomTextArea name={'notes'} label={'Notes'} />


							</DialogContent>

							<CustomDialogActions
								isSubmitting={isSubmitting}
								handleClose={handleClose}
								submitText={"Save"}
							/>
						</Form>
					)}
				</Formik>
			</Dialog>
		</React.Fragment>
	);
}
export default EditProfileModal