import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, TextField } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { colors } from '../../../../assets/scss/Colors/Colors';
import { Formik, Field, Form, FieldArray } from 'formik';
import { CustomField, CustomCheckBox } from '../../FormComponents/FormComponents';

import { StyledFilledInputSmall } from '../../StyledTableComponents/StyledInputs'

import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import StyledLabel from '../../StatusLabel/StatusLabel'
import { CustomDialogActions } from '../ModalsComponents'


import * as yup from "yup";
import { VehicleType } from '../../../../types/vehicles';
import { StatusEnum } from '../../../../types/types';

type VehiclesModalType = {
	initialValues: VehicleType
	titleText: string

	handleActivate?: (id: number) => void
	handleDelete?: (id: number) => void
}

const EditVehicleModal = ({ open, handleClose, initialValues, titleText, handleDelete, handleActivate, ...props }: ModalType & VehiclesModalType) => {
	const classes = useStyles();

	const submitProfileEdit = (data: any, setSubmitting: any) => {
		setSubmitting(true);

		// make async call
		console.log("submit: ", data);
		setSubmitting(false);
		handleClose()
	}

	if (!initialValues.vehicle_id) {
		initialValues = {
			vehicle_truck_number: '',
			eld_serial_number: '',
			vehicle_make_name: '',
			vehicle_model_name: '',
			// year: '',
			// fuel_type: '',
			vehicle_licence_plate: '',
			// state: '',
			// enter_vin_manually: false,
			// vin_number: '',
			vehicle_notes: ''
		}
	}

	const validationSchema = yup.object({
		vehicle_truck_number: yup.string().required(),
		eld_serial_number: yup.string(),
		vehicle_make_name: yup.string(),
		vehicle_model_name: yup.string(),
		// year: yup.string(),
		// fuel_type: yup.string(),
		vehicle_licence_plate: yup.string(),
		// state: yup.string(),
		// enter_vin_manually: yup.string(),
		// vin_number: yup.string(),
	});

	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-driver-dialog-title"
				className={classes.root}
			>
				<DialogTitle id="edit-driver-dialog-title" className={classes.dialog__header}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
						<div style={{ marginRight: '15px' }}>{titleText} <span>{initialValues.vehicle_truck_number} </span></div>
						<StyledLabel text={initialValues.vehicle_status} />
					</div>
					{initialValues.vehicle_id &&
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
						<StyledDefaultButtonSmall
							onClick={() => {
								if (initialValues.vehicle_id && handleDelete)
									handleDelete(initialValues.vehicle_id)
								handleClose()
							}}>Delete</StyledDefaultButtonSmall>

						<StyledDefaultButtonSmall
							onClick={() => {
								if (initialValues.vehicle_id && handleActivate)
									handleActivate(initialValues.vehicle_id)
							}}>{initialValues.vehicle_status === StatusEnum.Deactivated ? "Activate" : "Deactivate"}</StyledDefaultButtonSmall>

					</div>}
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
						submitProfileEdit(data, setSubmitting)
					}}
				>

					{({ values, errors, isSubmitting, }) => (
						<Form>
							<DialogContent className={classes.dialog__content}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '64px' }}>
									<div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'vehicle_truck_number'} label={'Truck No.'} />
											<CustomField name={'eld_serial_number'} label={'ELD No.'} optional={true} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'vehicle_make_name'} label={'Make'} optional={true} />
											<CustomField name={'vehicle_model_name'} label={'Model'} canSeeInputValue={true} optional={true} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											{/* <CustomField name={'year'} label={'Year'} optional={true} /> */}
											{/* <CustomField name={'fuel_type'} label={'Fuel Type'} optional={true} /> */}
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											{/* <CustomField name={'licence_number'} label={'Licence Plate'} optional={true} /> */}
											{/* <CustomField name={'state'} label={'Issuing State/Province'} optional={true} /> */}
										</div>

										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											{/* <CustomCheckBox name="enter_vin_manually" label="Enter VIN manually" optional={true} /> */}
											{/* <CustomField name={'vin_number'} label={'VIN'} disabled={!values.enter_vin_manually} optional={true} /> */}
										</div>

									</div>

									<div>
										{/* <CustomField name={'notes'} label={'Notes'} type="textarea" placeholder="Notes" optional={true} /> */}
									</div>
								</div>

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
export default EditVehicleModal