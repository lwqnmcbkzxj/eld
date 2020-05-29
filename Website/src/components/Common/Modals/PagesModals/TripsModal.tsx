import React, { useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Form } from 'formik';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { LabelType } from '../../../../types/types';

import { CustomField } from '../../FormComponents/FormComponents';
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";

import ViewTable from '../../ViewTable/ViewTable'

type TripsModalType = {
	labels: Array<LabelType>
	submitFunction: (dataObject: any) => void
	initialValues: any
	titleText: string
}


const EditProfileModal = ({ labels, open, handleClose, initialValues, titleText, submitFunction, ...props }: ModalType & TripsModalType) => {
	const classes = useStyles();

	const handleSubmit = async (data: any, setSubmitting: any) => {
		setSubmitting(true);
		await submitFunction(data)
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
	});

	// if (!initialValues.eld_id) {
	// 	initialValues = {
	// 	}
	// }


	// View table info fix
	if (initialValues.trip) {
		initialValues.trip = 'In progress'
	} else 
		initialValues.trip = 'Relaxing'
	
	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-trip-dialog-title"
				className={classes.root}
			>
				<DialogTitle id="edit-trip-dialog-title" className={classes.dialog__header}>
					{titleText}
				</DialogTitle>

				<div> 
				<ViewTable 
						rows={[initialValues]}
						labels={labels}
						style={{ padding: '0 15px', marginBottom: 0  }}
				/>
				</div>

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
						<Form style={{ paddingTop: 0 }}>
							<DialogContent className={classes.dialog__content}>
								<CustomField name={'note'} label={'Notes'} type="textarea" placeholder="Notes"/>
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