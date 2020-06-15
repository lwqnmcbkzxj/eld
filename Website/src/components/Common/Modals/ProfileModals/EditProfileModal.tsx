import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Field, Form, FieldArray } from 'formik';

import { useStyles } from '../ModalsStyle'

import { CompanyType } from '../../../../types/companies';
import { ModalType } from '../ModalsTypes'
import { UserType } from '../../../../types/user'
import { PasswordObjectType, AppStateType, SelectorType } from '../../../../types/types'

import * as yup from "yup";

import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledFilledInputSmall } from '../../../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'

import ChangePasswordModal from './ChangePasswordModal'
import Loader from '../../Loader/Loader';

import { getTimezones, getCompanyTerminals } from '../../../../redux/commonData-reducer';
import { getCompanyFromServer } from '../../../../redux/companies-reducer';
import { isFetchingArrContains } from '../../../../utils/isFetchingArrayContains';

type EditProfileType = {
	initialValues: any
	changePassword: (passwordObj: PasswordObjectType) => void
	editProfile: (profileObj: UserType) => void
	editCompany?: (companyObj: CompanyType, alertVisilbe?: boolean) => void
}

const EditProfileModal = ({ open, handleClose, changePassword, editProfile, editCompany = () => { }, initialValues, ...props }: ModalType & EditProfileType) => {
	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};

	const classes = useStyles();
	const dispatch = useDispatch()

	const terminals = useSelector<AppStateType, Array<SelectorType>>(state => state.common.terminals)
	const timezones = useSelector<AppStateType, Array<SelectorType>>(state => state.common.timezones)
	const company = useSelector<AppStateType, CompanyType>(state => state.companies.currentCompany)
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)


	useEffect(() => {
		(async function initModal() {
			if (open) {
				dispatch(getCompanyFromServer(initialValues.company_id))
				dispatch(getCompanyTerminals(initialValues.company_id))
				dispatch(getTimezones())
			}
		})()
	}, [open]);

	let [initialAddressesObj, setInitialAddressesObjects] = useState<any>([])
	useEffect(() => {
		//  Getting array [{name: ..., id: ..}], but need array with only strings. Setting initial values string array and using useState for addresses objects
		let initialAddressesObj = company.terminal_addresses
		company.terminal_addresses = []

		initialAddressesObj && initialAddressesObj.map((address: any) => {
			if (address.company_address_text)
				company.terminal_addresses.push(address.company_address_text)

			setInitialAddressesObjects(initialAddressesObj)
		})
	}, [company]);




	const submitProfileEdit = async (data: any, setSubmitting: any) => {
		setSubmitting(true);

		let userDataObject = { user_id: data.user_id } as UserType
		let uKey = "" as keyof UserType

		let userFields = [] as Array<string>
		for (let key in initialValues) { userFields.push(key) }

		let uFieldsCounter = 0
		for (uKey as any in data) {
			if (data[uKey] !== initialValues[uKey] && (uKey === 'user_first_name' || uKey === 'user_last_name' || uKey === 'user_email' || uKey === 'user_phone')) {
				userDataObject[uKey] = data[uKey]
				uFieldsCounter++
			}
		}

		



	type KeysOfUnion<T> = T extends any ? keyof T: never;
	type AvailableKeys = KeysOfUnion<CompanyType>; 

		let companyObject = { company_id: data.company_id } as any

		let companyFields = [] as Array<string>
		for (let key in company) { companyFields.push(key) }

		let cKey = "" as keyof CompanyType
		let cFieldsCounter = 0
		for (cKey as any in data) {
			if (data[cKey] !== company[cKey] && companyFields.includes(cKey)) {
				cFieldsCounter++
				companyObject[cKey] = data[cKey]
			}
		}


		companyObject.terminal_addresses = []
		data.terminal_addresses.map((address: any) => {
			let id = 0
			let filteredObject = initialAddressesObj.filter((addressObj: any) => addressObj.company_address_text === address)[0] as any
			if (filteredObject && filteredObject.company_address_id) {
				companyObject.terminal_addresses.push({
					company_address_id: filteredObject.company_address_id,
					company_address_text: address
				})
			} else {
				companyObject.terminal_addresses.push({ company_address_text: address })
			}

		})




		if (uFieldsCounter !== 0)
			await editProfile(userDataObject)

		// if user was changed - will be only one notification
		if (cFieldsCounter !== 0)
			await editCompany(companyObject, uFieldsCounter === 0)




		setSubmitting(false);
		handleClose()
	}
	
	const editValidationScema = yup.object({
		user_first_name: yup.string().min(2).max(30).nullable().required(),
		user_last_name: yup.string().min(2).max(30).nullable().required(),
		user_email: yup.string().nullable().email('Email must be valid').required(),
		user_phone: yup.string().nullable().required(),

		company_contact_name: yup.string().min(2).max(30).nullable().required(),
		company_contact_phone: yup.string().nullable().required(),
		company_usdot: yup.string().min(1).max(9).nullable().required(), 

		timezone_id: yup.string().nullable(),
		company_short_name: yup.string().min(2).max(32).nullable().required(),
		company_main_office_address: yup.string().min(2).max(128).nullable().required(),
		terminal_addresses: yup.array().of(yup.string().required('Terminal adress is required'))
	});

	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-profile-dialog-title"
				className={classes.root}
			>
				{isFetchingArrContains(isFetchingArray, ['company', 'timezones']) ?
					<Loader /> :
					<>
						<DialogTitle id="edit-profile-dialog-title" className={classes.dialog__header}>Edit Profile <span>{initialValues.user_first_name} {initialValues.user_last_name}</span></DialogTitle>

						<Formik
							validateOnChange={true}
							initialValues={{
								user_first_name: initialValues.user_first_name,
								user_last_name: initialValues.user_last_name,
								user_email: initialValues.user_email,
								user_phone: initialValues.user_phone,
								...company
							} as UserType & CompanyType}
							validationSchema={editValidationScema}
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
													<CustomField name={'user_first_name'} label={'First Name'} />
													<CustomField name={'user_last_name'} label={'Last Name'} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'user_email'} label={'E-mail'} />
													<CustomField name={'user_phone'} label={'Phone No.'} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'company_contact_name'} label={'Contact Name'} />
													<CustomField name={'company_contact_phone'} label={'Contact Phone No.'} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'company_usdot'} label={'USDOT'} />


													<CustomField
														name={'timezone_id'}
														label={'Company Timezone'}
														Component={CustomDropdown}
														values={timezones}
														onValueChange={setFieldValue}
													/>
												</div>

												<CustomField name={'company_short_name'} label={'Company Name'} />
											</div>

											<div>
												<CustomField name={'company_main_office_address'} label={'Company Address'} />

												<FieldArray name="terminal_addresses" render={arrayHelpers => (
													<div>
														{values.terminal_addresses && values.terminal_addresses.map((address, counter) => (
															<CustomField
																key={counter}
																name={`terminal_addresses.${counter}`}
																label={`${counter + 1} Terminal’s Address`}
																deleteFunc={() => {
																	arrayHelpers.remove(counter)
																}}
															/>
														))}

														<StyledDefaultButtonSmall onClick={() => arrayHelpers.push('')}>Add terminal</StyledDefaultButtonSmall>
													</div>
												)}
												/>
											</div>
										</div>

									</DialogContent>

									<DialogActions className={classes.dialog__actions} style={{ display: 'grid' }}>
										<StyledDefaultButtonSmall
											onClick={() => { setChangePasswordModalOpen(true) }}
											style={{ width: '200px' }}
										>Change password
								</StyledDefaultButtonSmall>


										<CustomDialogActions
											isSubmitting={isSubmitting}
											handleClose={handleClose}
											submitText={"Save"}

											style={{ padding: 0, borderTop: 'none' }}
										/>
									</DialogActions>
								</Form>
							)}
						</Formik>
					</>}
			</Dialog>



			{changePassword && changePasswordModalOpen &&
				<ChangePasswordModal
					open={changePasswordModalOpen}
					handleClose={handleChangePasswordModalClose}
					submitFunction={changePassword}
				/>}

		</React.Fragment>
	);
}
export default EditProfileModal