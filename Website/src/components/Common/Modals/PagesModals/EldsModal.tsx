import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { Formik, Field, Form, FieldArray } from 'formik';
import { CustomField } from '../../FormComponents/FormComponents';

import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'
import * as yup from "yup";
import { EldType } from '../../../../types/elds';


type EldModalType = {
	submitFunction: (dataObject: EldType) => void
	deleteFunction?: (id: number) => void
	initialValues: {
		eld_id?: number
		eld_serial_number?: string
		eld_note?: string
	}
	titleText: string
}


const EditProfileModal = ({ open, handleClose, initialValues, titleText, submitFunction, deleteFunction, ...props }: ModalType & EldModalType) => {
	const classes = useStyles();

	const handleSubmit = async (data: any, setSubmitting: any) => {
		setSubmitting(true);
		await submitFunction(data)
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		eld_serial_number: yup.string().required(),
		eld_note: yup.string().required(),
	});

	if (!initialValues.eld_id) {
		initialValues = {
			eld_serial_number: '',
			eld_note: '',
		}
	}

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

					{ initialValues.eld_id && 
					<StyledDefaultButtonSmall
						onClick={() => {
							if (initialValues.eld_id && deleteFunction)
								deleteFunction(initialValues.eld_id)
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

								<CustomField name={'eld_serial_number'} label={'Serial No.'} />
								<CustomField name={'eld_note'} label={'Notes'} type="textarea" placeholder="Notes"/>

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