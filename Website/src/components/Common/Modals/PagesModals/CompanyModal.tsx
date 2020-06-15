import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useStyles } from '../ModalsStyle'
import { Formik, Form, FieldArray } from 'formik';
import * as yup from "yup";

import { ModalType } from '../ModalsTypes'
import { CompanyType } from '../../../../types/companies';
import { PasswordObjectType, AppStateType, SelectorType, StatusEnum } from '../../../../types/types'

import StyledLabel from '../../StatusLabel/StatusLabel'
import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'
import ChangePasswordModal from '../ProfileModals/ChangePasswordModal'
import Loader from '../../Loader/Loader';

import { getTimezones } from '../../../../redux/commonData-reducer'
import { toggleCompanyActivation, deleteCompany } from '../../../../redux/companies-reducer'
import { isFetchingArrContains } from '../../../../utils/isFetchingArrayContains';


type CompanyModalType = {
	initialValues: CompanyType | any
	titleText: string

	submitFunction: (company: CompanyType) => void
	changePassword?: (userId: number, passwordObj: PasswordObjectType) => void
}

const EditCompanyModal = ({
	open, handleClose,
	titleText, initialValues,
	submitFunction, changePassword, ...props }: ModalType & CompanyModalType) => {

	const classes = useStyles();
	const dispatch = useDispatch()
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)

	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};


	const timezones = useSelector<AppStateType, Array<SelectorType>>(state => state.common.timezones)
	const subscriptionTypes = useSelector<AppStateType, Array<SelectorType>>(state => state.common.subscriptionTypes)

	useEffect(() => {
		(async function initModal() {
			if (open) {
				dispatch(getTimezones())
			}
		})()
	}, [open]);



	let [initialAddressesObj, setInitialAddressesObjects] = useState<any>([])
	let [terminalAddresses, setTerminalAddresses] = useState([''])
	useEffect(() => {
		//  Getting array [{name: ..., id: ..}], but need array with only strings. Setting initial values string array and using useState for addresses objects
		let initialAddressesObj = initialValues.terminal_addresses as Array<any>

		let terminalAddresses = [] as Array<string>

		initialAddressesObj && initialAddressesObj.map((address: any) => {
			if (address.company_address_text)
				terminalAddresses.push(address.company_address_text)

			setInitialAddressesObjects(initialAddressesObj)
			setTerminalAddresses(terminalAddresses)
		})
	}, [initialValues as Array<any>]);

	let initialValuesObj = {
		company_short_name: '',

		company_main_office_address: '',
		company_subscribe_type: '',
		timezone_id: -1,
		company_contact_name: '',
		company_contact_phone: '',
		company_email: '',
		company_usdot: '',
		...initialValues,
		terminal_addresses: [...terminalAddresses],
	}





	const handleSubmit = async (data: CompanyType, setSubmitting: any) => {
		setSubmitting(true);

		let dataObj = {} as any
		let key = "" as keyof CompanyType
		if (data.company_id) {
			for (key in data) {
				if (data[key] !== initialValues[key] || key === 'company_id') {
					dataObj[key] = data[key]
				}
			}
			dataObj.company_id = dataObj.company_id.toString()
		} else {
			for (key in data) {
				if (data[key] !== initialValues[key]) {
					dataObj[key] = data[key]
				}
			}
		}



		dataObj.terminal_addresses = []
		data.terminal_addresses.map(address => {
			let id = 0
			let filteredObject = initialAddressesObj.filter((addressObj: any) => addressObj.company_address_text === address)[0] as any
			if (filteredObject && filteredObject.company_address_id) {
				dataObj.terminal_addresses.push({
					company_address_id: filteredObject.company_address_id,
					company_address_text: address
				})
			} else {
				dataObj.terminal_addresses.push({ company_address_text: address })
			}

		})


		await submitFunction(dataObj)

		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		company_short_name: yup.string().min(2).max(32).required(),

		company_main_office_address: yup.string().min(2).max(128).required(),
		company_subscribe_type: yup.string().required(),
		timezone_id: yup.number().required(),
		company_contact_name: yup.string().min(2).max(32).required(),
		company_contact_phone: yup.string().required(),
		company_email: yup.string().required().email('E-mail must be valid'),
		company_usdot: yup.string().min(1).max(9).required(),

		terminal_adresses: yup.array().of(yup.string().required('Terminal adress is required'))
	});



	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-company-dialog-title"
				className={classes.root}
			>

				{isFetchingArrContains(isFetchingArray, ['company', 'timezones']) ?
					<Loader /> :
					<>
						<DialogTitle id="edit-company-dialog-title" className={classes.dialog__header}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
								<div style={{ marginRight: '15px' }}>{titleText} <span>{initialValues.company_short_name}</span></div>
								{initialValues.company_id && <StyledLabel text={initialValues.company_status} />}
							</div>


							{initialValues.company_id &&
								<div className={classes.header__buttons}>
									<StyledDefaultButtonSmall
										onClick={async () => {
											await dispatch(deleteCompany(initialValues.company_id))
											handleClose()
										}}>Delete</StyledDefaultButtonSmall>

									<StyledDefaultButtonSmall
										onClick={async () => {
											await dispatch(toggleCompanyActivation(initialValues.company_id, initialValues.company_status as StatusEnum))
											handleClose()
										}}
									>{initialValues.company_status === StatusEnum.ACTIVE ? "Deactivate" : "Activate"}</StyledDefaultButtonSmall>
								</div>}
						</DialogTitle>

						<Formik
							// validateOnChange={true}
							validateOnChange={false}
							initialValues={{ ...initialValuesObj }}
							validationSchema={validationSchema}
							validate={values => {
								const errors: Record<string, string> = {};
								return errors;
							}}
							onSubmit={(data, { setSubmitting }) => {
								handleSubmit(data, setSubmitting)
							}}
						>

							{({ values, isSubmitting, setFieldValue }) => (
								<Form>
									<DialogContent className={classes.dialog__content}>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '64px' }}>
											<div>
												<CustomField name={'company_short_name'} label={'Company Name'} />
												<CustomField name={'company_main_office_address'} label={'Company Address'} />

												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField
														name={'company_subscribe_type'}
														label={'Subscribe Type'}
														Component={CustomDropdown}
														values={subscriptionTypes}
														onValueChange={setFieldValue}
													/>
													<CustomField
														name={'timezone_id'}
														label={'Company Timezone'}
														Component={CustomDropdown}
														values={timezones}
														onValueChange={setFieldValue}
													/>
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'company_contact_name'} label={'Contact Name'} />
													<CustomField name={'company_contact_phone'} label={'Contact Phone No.'} />
												</div>
												<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
													<CustomField name={'company_email'} label={'E-mail'} />
													<CustomField name={'company_usdot'} label={'USDOT'} />
												</div>
											</div>

											<div>
												<FieldArray name="terminal_addresses" render={arrayHelpers => (
													<div>
														{values.terminal_addresses.map((address: any, counter: any) => (
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
					submitFunction={(passwordObj: PasswordObjectType) => { changePassword(initialValues.user_id, passwordObj) }}
					isUser={true}
				/>}

		</React.Fragment>
	);
}
export default EditCompanyModal