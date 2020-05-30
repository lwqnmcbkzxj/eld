import React, { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Form } from 'formik';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { VehicleType } from '../../../../types/vehicles';

import { CustomField, CustomCheckBox, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall } from '../../StyledTableComponents/StyledButtons';
import StyledLabel from '../../StatusLabel/StatusLabel'
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";
import { StatusEnum, AppStateType } from '../../../../types/types';


import { getVehicleFromServer } from '../../../../redux/vehicles-reducer'
import { useSelector, useDispatch } from 'react-redux';


type VehiclesModalType = {
	initialValues: VehicleType
	titleText: string

	handleActivate?: (id: number) => void
	handleDelete?: (id: number) => void
}

const EditVehicleModal = ({ open, handleClose, initialValues, titleText, handleDelete, handleActivate, ...props }: ModalType & VehiclesModalType) => {
	const classes = useStyles();
	const dispatch = useDispatch()
	const vehicle = useSelector<AppStateType, VehicleType>(state => state.vehicles.currentVehicle)


	// const getVehicle = async (vehicleId: number) => {
	// 	await dispatch(getVehicleFromServer(vehicleId))
	// 	initialValues = vehicle 
	// }

	// useEffect( () => {
	// 	if (initialValues.vehicle_id && open) {
	// 		getVehicle(initialValues.vehicle_id)
	// 	}
	// }, [open]);
	

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

			year: '',
			fuel_type: '',

			vehicle_licence_plate: '',

			state: '',
			enter_vin_manually: false,
			vehicle_vin: '',
			
			vehicle_notes: ''
		}
	}

	const validationSchema = yup.object({
		vehicle_truck_number: yup.string().required(),
		eld_serial_number: yup.string(),
		vehicle_make_name: yup.string(),
		vehicle_model_name: yup.string(),
		year: yup.string(),
		fuel_type: yup.string(),
		vehicle_licence_plate: yup.string(),
		state: yup.string(),
		enter_vin_manually: yup.string(),
		vehicle_vin: yup.string(),
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
						{initialValues.vehicle_status && <StyledLabel text={initialValues.vehicle_status} /> }
					</div>
					{initialValues.vehicle_id &&
						<div
						// style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}
					>
						{/* <StyledDefaultButtonSmall
							onClick={() => {
								if (initialValues.vehicle_id && handleDelete)
									handleDelete(initialValues.vehicle_id)
								handleClose()
							}}>Delete</StyledDefaultButtonSmall> */}

						<StyledDefaultButtonSmall
							onClick={() => {
								if (initialValues.vehicle_id && handleActivate)
									handleActivate(initialValues.vehicle_id)
							}}>{initialValues.vehicle_status === StatusEnum.Deactivated ? "Activate" : "Deactivate"}</StyledDefaultButtonSmall>

					</div>}
				</DialogTitle>

				<Formik
					validateOnChange={true}

					enableReinitialize={true}
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

					{({ values, errors, isSubmitting, setFieldValue }) => (
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
											<CustomField name={'vehicle_model_name'} label={'Model'} optional={true} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField
												name={'year'}
												label={'Year'}
												Component={CustomDropdown}
												values={[
													{ value: '2012', id: 1 },
													{ value: '2011', id: 2 },
													{ value: '2010', id: 3 },
													{ value: '2009', id: 4 },
												]}
												onValueChange={setFieldValue}
												optional={true} 
											/>
											<CustomField
												name={'fuel_type'}
												label={'Fuel Type'}
												Component={CustomDropdown}
												values={[
													{ value: 'Diesel', id: 1 },
													{ value: 'D2', id: 2 },
													{ value: 'D3', id: 3 },
													{ value: 'D4', id: 4 },
												]}
												onValueChange={setFieldValue}
												optional={true}
											/>
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'licence_number'} label={'Licence Plate'} optional={true} />
											<CustomField
												name={'state'}
												label={'Issuing State/Province'}
												Component={CustomDropdown}
												values={[
													{ value: 'Illinois', id: 1 },
													{ value: 'Washington', id: 2 },
													{ value: 'Kentucky', id: 3 },
													{ value: 'Louisiana', id: 4 },
												]}
												onValueChange={setFieldValue}
											/>
										</div>

										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomCheckBox name="enter_vin_manually" label="Enter VIN manually" optional={true} />
											<CustomField name={'vehicle_vin'} label={'VIN'} disabled={!values.enter_vin_manually} optional={true} />
										</div>

									</div>

									<div>
										<CustomField name={'notes'} label={'Notes'} type="textarea" placeholder="Notes" optional={true} />
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