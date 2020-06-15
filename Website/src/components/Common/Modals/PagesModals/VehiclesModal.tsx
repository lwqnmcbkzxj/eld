import React, { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogTitle, CircularProgress } from '@material-ui/core';
import { Formik, Form } from 'formik';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { VehicleType } from '../../../../types/vehicles';
import { UserType } from '../../../../types/user';
import { EldType } from '../../../../types/elds';
import { StatusEnum, AppStateType, SelectorType } from '../../../../types/types';

import { CustomField, CustomCheckBox, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall } from '../../StyledTableComponents/StyledButtons';
import StyledLabel from '../../StatusLabel/StatusLabel'
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";

import { getVehicleFromServer } from '../../../../redux/vehicles-reducer'
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../Loader/Loader';

import { isFetchingArrContains } from '../../../../utils/isFetchingArrayContains'
import { getStates, getFuelTypes, getYears } from '../../../../redux/commonData-reducer';
import { getEldsFromServer } from '../../../../redux/elds-reducer'

import { toggleVehicleActivation, deleteVehicle } from '../../../../redux/vehicles-reducer'

type VehiclesModalType = {
	initialValues: VehicleType
	titleText: string

	confirmFunction: (vehicle: VehicleType) => void

}

const EditVehicleModal = ({ open, handleClose, initialValues, titleText, confirmFunction, ...props }: ModalType & VehiclesModalType) => {
	const classes = useStyles();
	const dispatch = useDispatch()
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)

	const fuelTypes = useSelector<AppStateType, Array<SelectorType>>(state => state.common.fuelTypes)
	const states = useSelector<AppStateType, Array<SelectorType>>(state => state.common.states)
	const years = useSelector<AppStateType, Array<SelectorType>>(state => state.common.years)

	const elds = useSelector<AppStateType, Array<EldType>>(state => state.elds.elds)

	const [eldsSelectors, setEldsSelectors] = useState<Array<SelectorType>>([])

	useEffect(() => {
		let eldsArray = [] as Array<SelectorType>
		elds.map(eld => {
			eldsArray.push({ id: eld.eld_id as number, value: eld.eld_serial_number as string })
		})
		setEldsSelectors(eldsArray)
	}, [elds])


	useEffect(() => {
		(async function initModal() {
			if (open) {
				dispatch(getEldsFromServer(loggedUser.company_id))
				dispatch(getYears())
				dispatch(getFuelTypes())
				dispatch(getStates())
			}

		})()
	}, [open]);

	useEffect(() => {
		if (initialValues.vehicle_id) {
			let key = "" as keyof VehicleType
			for (key in initialValues) {
				if (key === 'vehicle_enter_vin_manually_flag') {
					let val = initialValues[key]
					initialValues[key] = !!val as boolean
				}
			}
		}

	}, [initialValues])


	const submitProfileEdit = async (data: VehicleType, setSubmitting: any) => {
		setSubmitting(true);


		let newDataObj = {} as any
		let changedKeysCounter = 0
		let key = "" as keyof VehicleType
		for (key in data) {
			if (data[key] !== initialValues[key] || key === 'vehicle_id') {
				if (key !== 'vehicle_id') {
					changedKeysCounter++
				}

				if (key === "vehicle_enter_vin_manually_flag" && data[key] !== undefined)
					newDataObj[key] =  +data[key]
				else
					newDataObj[key] = data[key]
			}
		}

	
		if (!newDataObj.vehicle_id) {
			changedKeysCounter = 1	
			newDataObj.company_id = loggedUser.company_id			
		}

		if (changedKeysCounter !== 0)
			await confirmFunction(newDataObj)
		
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		vehicle_truck_number: yup.number().required(),
		eld_id: yup.number().nullable(),
		vehicle_make_name: yup.string().nullable(),
		vehicle_model_name: yup.string().nullable(),
		vehicle_issue_year: yup.number().nullable(),
		vehicle_fuel_type: yup.string().nullable(),
		vehicle_licence_plate: yup.string().min(1).max(20).nullable(),
		issuing_state_id: yup.number().nullable(),
		vehicle_enter_vin_manually_flag: yup.boolean().nullable(),
		vehicle_vin: yup.string().min(17).max(18).nullable(),
		vehicle_notes: yup.string().min(0).max(60).nullable()
	});

	if (!initialValues.vehicle_id) {
		initialValues = {
			vehicle_truck_number: ''
		} as VehicleType
	}

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

				{isFetchingArrContains(isFetchingArray, ['vehicle', 'fuel-types', 'states', 'elds']) ?
					<Loader /> :
					<>
						<DialogTitle id="edit-driver-dialog-title" className={classes.dialog__header}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
								<div style={{ marginRight: '15px' }}>{titleText} <span>{initialValues.vehicle_truck_number} </span></div>
								{initialValues.vehicle_status && <StyledLabel text={initialValues.vehicle_status} />}
							</div>
							{initialValues.vehicle_id &&
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
									<StyledDefaultButtonSmall
										onClick={async() => {
											await dispatch(deleteVehicle(initialValues.vehicle_id as number, loggedUser.company_id))
											handleClose()
										}}>Delete</StyledDefaultButtonSmall>

									<StyledDefaultButtonSmall
										onClick={async () => {
											await dispatch(toggleVehicleActivation(initialValues.vehicle_id, initialValues.vehicle_status, loggedUser.company_id))
											handleClose()
												
										}}>{initialValues.vehicle_status === StatusEnum.ACTIVE ? "Deactivate" : "Activate"}</StyledDefaultButtonSmall>

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
													
													<CustomField
														name={'eld_id'}
														label={'ELD No.'}
														Component={CustomDropdown}
														values={eldsSelectors}
														onValueChange={setFieldValue}
														optional={true}
													/>
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'vehicle_make_name'} label={'Make'} optional={true} />
													<CustomField name={'vehicle_model_name'} label={'Model'} optional={true} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField
														name={'vehicle_issue_year'}
														label={'Year'}
														Component={CustomDropdown}
														values={years}
														onValueChange={setFieldValue}
														optional={true}
													/>
													<CustomField
														name={'vehicle_fuel_type'}
														label={'Fuel Type'}
														Component={CustomDropdown}
														values={fuelTypes}
														onValueChange={setFieldValue}
														optional={true}
													/>
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'vehicle_licence_plate'} label={'Licence Plate'} optional={true} />
													<CustomField
														name={'issuing_state_id'}
														label={'Issuing State/Province'}
														Component={CustomDropdown}
														values={states}
														onValueChange={setFieldValue}
														optional={true} 
													/>
												</div>

												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomCheckBox name="vehicle_enter_vin_manually_flag" label="Enter VIN manually" optional={true} />
													<CustomField name={'vehicle_vin'} label={'VIN'} disabled={!values.vehicle_enter_vin_manually_flag} optional={true} />
												</div>

											</div>

											<div>
												<CustomField name={'vehicle_notes'} label={'Notes'} type="textarea" placeholder="Notes" optional={true} />
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
					</>}
			</Dialog>
		</React.Fragment>
	);
}
export default EditVehicleModal