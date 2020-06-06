import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Checkbox } from '@material-ui/core';
import { Formik, Field, Form, FieldArray } from 'formik';
import { useStyles } from '../ModalsStyle'
import { useSelector, useDispatch, Selector } from 'react-redux';

import { ModalType } from '../ModalsTypes'
import { AppStateType, SelectorType } from '../../../../types/types';
import { UserType, RolesEnum } from '../../../../types/user';
import { VehicleType } from '../../../../types/vehicles';
import { DriverType } from '../../../../types/drivers';
import { CompanyType } from '../../../../types/companies';

import { CustomField, CustomCheckBox, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import StyledLabel from '../../StatusLabel/StatusLabel'
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";
import { isFetchingArrContains } from '../../../../utils/isFetchingArrayContains';
import Loader from '../../Loader/Loader';
import { getStates, getCompanyTerminals, getTimezones } from '../../../../redux/commonData-reducer';
import { getVehiclesFromServer } from '../../../../redux/vehicles-reducer';
import { getDriversFromServer } from '../../../../redux/drivers-reducer';
import { getCompaniesFromServer } from '../../../../redux/companies-reducer';


type DriversModal = {
	initialValues: UserType
	titleText: string
	submitFunction: (driverObject: UserType) => void
}

const EditProfileModal = ({ open, handleClose, initialValues, titleText, submitFunction, ...props }: ModalType & DriversModal) => {
	const classes = useStyles();
	const dispatch = useDispatch()
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)

	// Common data
	const states = useSelector<AppStateType, Array<SelectorType>>(state => state.common.states)
	const timezones = useSelector<AppStateType, Array<SelectorType>>(state => state.common.timezones)
	const terminals = useSelector<AppStateType, Array<SelectorType>>(state => state.common.terminals)

	// Calculating data
	const vehicles = useSelector<AppStateType, Array<VehicleType>>(state => state.vehicles.vehicles)
	const drivers = useSelector<AppStateType, Array<DriverType>>(state => state.drivers.drivers)
	const companies = useSelector<AppStateType, Array<CompanyType>>(state => state.companies.companies)


	// Calculated data
	const [vehiclesSelectors, setVehiclesSelectors] = useState<Array<SelectorType>>([])
	const [driversSelectors, setDriversSelectors] = useState<Array<SelectorType>>([])
	const [companiesSelectors, setCompaniesSelectors] = useState<Array<SelectorType>>([{ id: 0, value: "" }])

	useEffect(() => {
		let veihlcesArray = [] as Array<SelectorType>
		vehicles.map(vehicle => {
			veihlcesArray.push({ id: vehicle.vehicle_id as number, value: vehicle.vehicle_truck_number as string })
		})
		setVehiclesSelectors(veihlcesArray)
	}, [vehicles])

	useEffect(() => {
		let driversArray = [] as Array<SelectorType>
		drivers.map(driver => {
			if (driver.user_id !== initialValues.user_id)
				driversArray.push({ id: driver.user_id as number, value: driver.user_full_name as string })
		})
		setDriversSelectors(driversArray)
	}, [drivers])
	useEffect(() => {
		let companiesArray = [] as Array<SelectorType>
		companies.map(company => {
			companiesArray.push({ id: company.company_id as number, value: company.company_short_name as string })
		})
		setCompaniesSelectors(companiesArray)
	}, [companies])

	useEffect(() => {
		(async function initModal() {
			if (open) {
				let companyId = 0
				if (initialValues.company_id)
					companyId = initialValues.company_id
				else
					companyId = loggedUser.company_id

				dispatch(getStates())
				dispatch(getTimezones())
				dispatch(getDriversFromServer(companyId, 'drivers-modal'))
				dispatch(getCompanyTerminals(companyId))
				dispatch(getVehiclesFromServer(companyId))

				if (loggedUser.role_id === RolesEnum.admin) {
					dispatch(getCompaniesFromServer())
				}
			}
		})()
	}, [open]);



	useEffect(() => {
		let key = "" as keyof UserType
		for (key in initialValues) {
			if (key === "user_personal_conveyance_flag" || key === "user_eld_flag" || key === "user_yard_move_flag" || key === "user_manual_drive_flag") {
				if (initialValues[key] === null) {
					initialValues[key] = false
				}
			}
		}
	}, [initialValues])


	const submitProfileEdit = async (data: UserType, setSubmitting: any) => {
		setSubmitting(true);

		let newDataObj = {} as any
		let key = "" as keyof UserType
		for (key in data) {
			if (data[key] !== initialValues[key] || key === 'user_id') {
				if (key === "user_personal_conveyance_flag" || key === "user_eld_flag" || key === "user_yard_move_flag" || key === "user_manual_drive_flag")
					newDataObj[key] = +data[key]
				else
					newDataObj[key] = data[key]
			}
		}

		if (!newDataObj.user_id) {
			newDataObj.role_id = 1
			if (!initialValues.company_id) 
				newDataObj.company_id = loggedUser.company_id
			else 
				newDataObj.company_id = initialValues.company_id
				
				
		}
		await submitFunction(newDataObj)

		setSubmitting(false);
		handleClose()
	}

	let initialValuesObj = {
		user_first_name: '',
		user_last_name: '',
		user_login: '',
		user_password: '',
		user_phone: '',
		user_driver_licence: '',
		issuing_state_id: '',
		company_id: '',

		user_personal_conveyance_flag: false,
		user_yard_move_flag: false,
		user_eld_flag: false,
		user_manual_drive_flag: false,
	}

	const validationSchema = yup.object({
		user_first_name: yup.string().nullable().required(),
		user_last_name: yup.string().nullable().required(),
		user_login: yup.string().nullable().required(),
		user_password: initialValues.user_id ? yup.string().nullable().required().min(8).max(24) : yup.string().nullable().min(8).max(24),
		user_email: yup.string().nullable().email('Email must be valid'),
		user_phone: yup.string().nullable().required(),
		user_driver_licence: yup.string().nullable().required(),
		issuing_state_id: yup.number().nullable().required(),

		// vehicle_id: yup.number().nullable(),
		// user_trailer_number: yup.string().nullable(),
		// user_personal_conveyance_flag: yup.boolean().nullable(),
		// user_yard_move_flag: yup.boolean().nullable(),
		// user_eld_flag: yup.boolean().nullable(),
		// user_manual_drive_flag: yup.boolean().nullable(),
		// co_driver_id: yup.number().nullable(),

		company_id: loggedUser.role_id === RolesEnum.admin ? yup.number().nullable().required() : yup.number().nullable(),
		// company_address_id: yup.number().nullable(),
		// timezone_id: yup.number().nullable(),

		// user_notes: yup.string().nullable(),
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

				{isFetchingArrContains(isFetchingArray, ['driver', 'terminals', 'states', 'vehicles', 'drivers-modal', 'companies']) ?
					<Loader /> :
					<>
						<DialogTitle id="edit-driver-dialog-title" className={classes.dialog__header}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
								<div style={{ marginRight: '15px' }}>{titleText} {initialValues.user_first_name && initialValues.user_last_name && <span>{initialValues.user_first_name + ' ' + initialValues.user_last_name} </span>}</div>
								{initialValues.user_id && <StyledLabel text={"ACTIVE"} />}
							</div>

							{initialValues.user_id &&
								<StyledDefaultButtonSmall
									onClick={() => {
										console.log('DEACTIVATING ' + initialValues.user_id);
										handleClose()
									}}
								>Deactivate</StyledDefaultButtonSmall>}
						</DialogTitle>

						<Formik
							validateOnChange={true}
							initialValues={{ ...initialValuesObj, ...initialValues }}
							validationSchema={validationSchema}
							validate={values => {
								const errors: Record<string, string> = {};
								return errors;
							}}
							onSubmit={(data, { setSubmitting }) => {
								debugger
								submitProfileEdit(data, setSubmitting)
							}}
						>

							{({ values, errors, isSubmitting, setFieldValue }) => (
								<Form>
									<DialogContent className={classes.dialog__content}>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '64px' }}>
											<div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'user_first_name'} label={'First Name'} />
													<CustomField name={'user_last_name'} label={'Last Name'} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'user_login'} label={'Username'} />
													<CustomField name={'user_password'} label={'Password'} canSeeInputValue={true} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'user_email'} label={'Email'} optional={true} />
													<CustomField name={'user_phone'} label={'Phone No.'} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'user_driver_licence'} label={'Driver’s Licence No.'} />

													<CustomField
														name={'issuing_state_id'}
														label={'Issuing State/Province'}
														Component={CustomDropdown}
														values={states}
														onValueChange={setFieldValue}
													/>
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>

													<CustomField
														name={'vehicle_id'}
														label={'Truck No.'}
														Component={CustomDropdown}
														values={vehiclesSelectors}
														onValueChange={setFieldValue}
														optional={true}
													/>

													<CustomField name={'user_trailer_number'} label={'Trailer No.'} optional={true} />

												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomCheckBox name="user_personal_conveyance_flag" label="Personal Conveyance" />
													<CustomCheckBox name="user_yard_move_flag" label="Yard move" />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomCheckBox name="user_eld_flag" label="ELD (no exemption)" />
													<CustomCheckBox name="user_manual_drive_flag" label="Allow Manual Drive Time" />
												</div>
											</div>

											<div>
												<CustomField
													name={'co_driver_id'}
													label={'Co-Driver'}
													Component={CustomDropdown}
													values={driversSelectors}
													onValueChange={setFieldValue}
													optional={true}
												/>

												{loggedUser.role_id === RolesEnum.admin &&
													<CustomField
														name={'company_id'}
														label={'Company'}
														Component={CustomDropdown}
														values={companiesSelectors}
														onValueChange={setFieldValue}
													/>

												}

												<CustomField
													name={'company_address_id'}
													label={'Home Terminal Address'}
													Component={CustomDropdown}
													values={terminals}
													onValueChange={setFieldValue}
													optional={true}
												/>
												<CustomField
													name={'timezone_id'}
													label={'Home Terminal Timezone'}
													Component={CustomDropdown}
													values={timezones}
													onValueChange={setFieldValue}
													optional={true}
												/>

												<CustomField name={'user_notes'} label={'Notes'} type="textarea" placeholder="Notes" optional={true} />
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
export default EditProfileModal