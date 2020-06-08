import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { colors } from '../../../../assets/scss/Colors/Colors';
import { Formik, Field, Form, FieldArray } from 'formik';
import { CustomField } from '../../FormComponents/FormComponents';
import { CustomDialogActions } from '../ModalsComponents'

import { PasswordObjectType } from '../../../../types/types'
import { ResultCodesEnum } from '../../../../api/types'
import * as yup from "yup";

type ChangePasswordType = {
	submitFunction: (passwordObject: PasswordObjectType) => void
	isUser?: boolean
}

const ChangePassword = ({ open, handleClose, submitFunction, isUser = false, ...props }: ModalType & ChangePasswordType) => {
	const classes = useStyles();

	const handleSubmit = async (data: any, setSubmitting: any) => {
		setSubmitting(true);

		if (data.old_password === "") {
			data.old_password = 'old_password'
		}
		await submitFunction(data);
 
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		old_password: isUser ? yup.string() : yup.string().required().min(8).max(24),
		new_password: yup.string().required().min(8).max(24),
		new_password_confirmation: yup.string().required().min(8).max(24).test('passwords-match', `Passwords don't match`, function(value) {
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
				<DialogTitle id="change-password-dialog-title" className={classes.dialog__header}>Change password</DialogTitle>

				<Formik
					validateOnChange={true}
					initialValues={{
						old_password: '',
						new_password: '',
						new_password_confirmation: ''
					}}
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
								<CustomField
									name={'old_password'}
									label={'Current Password'}
									placeholder="********"
									canSeeInputValue={true}
									disabled={isUser}
									
								/>
								<CustomField 
									name={'new_password'} 
									label={'New Password'} 
									placeholder="********"
									canSeeInputValue={true}
								/>
								<CustomField 
									name={'new_password_confirmation'} 
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
export default ChangePassword