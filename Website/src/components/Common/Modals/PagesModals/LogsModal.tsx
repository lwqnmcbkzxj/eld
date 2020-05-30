import React, { useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Form } from 'formik';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { LabelType } from '../../../../types/types';

import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";

import ViewTable from '../../ViewTable/ViewTable'

type LogsModalType = {
	submitFunction: (dataObject: any) => void
	initialValues: any
	titleText: string
}


const LogsModal = ({ open, handleClose, initialValues, titleText, submitFunction, ...props }: ModalType & LogsModalType) => {
	const classes = useStyles();

	const handleSubmit = async (data: any, setSubmitting: any) => {
		setSubmitting(true);
		// await submitFunction(data)
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
	});

	// if (!initialValues.eld_id) {
	// 	initialValues = {
	// 	}
	// }


	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-log-dialog-title"
				className={classes.root}
			>
				<DialogTitle id="edit-log-dialog-title" className={classes.dialog__header}>
					{titleText}
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

					{({ values, errors, isSubmitting, setFieldValue }) => (
						<Form style={{ paddingTop: 0 }}>
							<DialogContent className={classes.dialog__content}>



								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
									<CustomField
										name={'status'}
										label={'Status'}
										Component={CustomDropdown}
										values={[
											{ value: 'On duty', id: 1 },
											{ value: 'Status2', id: 2 },
											{ value: 'Status3', id: 3 },
											{ value: 'Status4', id: 4 },
										]}
										onValueChange={setFieldValue}
									/>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '8px' }}>
										<CustomField name={'time'} label={'Time'} />
										<CustomField
											name={'day_phase'}
											label={''}
											Component={CustomDropdown}
											values={[
												{ value: 'AM', id: 1 },
												{ value: 'PM', id: 2 },
											]}
											onValueChange={setFieldValue}
										/>

									</div>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
										<CustomField name={'location_name'} label={'Location Name'} />
										<CustomField name={'location_coordinate'} label={'Location Coordinate'} />
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
										<CustomField name={'odometer'} label={'Odometer, mi'} />
										<CustomField name={'eng_hours'} label={'Eng. Hour'} />
									</div>
								<CustomField name={'note'} label={'Notes'} type="textarea" placeholder="Notes" optional={true} />
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
export default LogsModal