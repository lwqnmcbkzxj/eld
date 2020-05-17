import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { colors } from '../../../../assets/scss/Colors/Colors';
import { Formik, Field, Form, FieldArray } from 'formik';
import { CustomField } from '../../FormComponents/FormComponents';

import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";


const EditProfileModal = ({ open, handleClose, ...props }: ModalType) => {
	const classes = useStyles();

	const submitPasswordChange = (data: any, setSubmitting: any) => {
		setSubmitting(true);
		// make async call
		console.log("submit: ", data);
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		password: yup.string().required().min(8).max(24),
		new_password: yup.string().required().min(8).max(24),
		confirm_password: yup.string().required().min(8).max(24).test('passwords-match', `Passwords don't match`, function(value) {
			return this.parent.new_password === value;
		  }),
	});

	return (
		<React.Fragment>
			<Dialog
				fullWidth={false}
				maxWidth={'xs'}
				open={open}
				onClose={handleClose}
				aria-labelledby="change-password-dialog-title"
				className={classes.root}
			>
				<DialogTitle id="change-password-dialog-titlee" className={classes.dialog__header}>Change password</DialogTitle>

				<Formik
					validateOnChange={true}
					initialValues={{
						password: '',
						new_password: '',
						confirm_password: ''
					}}
					validationSchema={validationSchema}
					validate={values => {
						const errors: Record<string, string> = {};
						
						return errors;
					}}
					onSubmit={(data, { setSubmitting }) => {
						submitPasswordChange(data, setSubmitting)
					}}
				>

					{({ values, errors, isSubmitting }) => (
						<Form>
							<DialogContent className={classes.dialog__content}>
								<CustomField
									name={'password'}
									label={'Current Password'}
									placeholder="********"
									canSeeInputValue={true}
								/>
								<CustomField 
									name={'new_password'} 
									label={'New Password'} 
									placeholder="********"
									canSeeInputValue={true}
								/>
								<CustomField 
									name={'confirm_password'} 
									label={'Confirm Password'} 
									placeholder="********"
									canSeeInputValue={true}
								/>

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