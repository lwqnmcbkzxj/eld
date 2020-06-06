import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useStyles } from '../ModalsStyle'
import { Formik, Form, FieldArray } from 'formik';
import * as yup from "yup";

import { ModalType } from '../ModalsTypes'
import { CompanyType } from '../../../../types/companies';
import { PasswordObjectType, AppStateType, SelectorType, StatusEnum } from '../../../../types/types'

import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'
import ChangePasswordModal from '../ProfileModals/ChangePasswordModal'
import Loader from '../../Loader/Loader';

import { getTimezones } from '../../../../redux/commonData-reducer'
import { isFetchingArrContains } from '../../../../utils/isFetchingArrayContains';


type CompanyModalType = {
	initialValues: CompanyType | any
	titleText: string

	submitFunction: (company: CompanyType) => void
	changePassword?: (passwordObj: PasswordObjectType) => void

	handleActivate?: (comapnyId: number) => void
	handleDeactivate?: (comapnyId: number) => void
}

const EditCompanyModal = ({
	open, handleClose,
	titleText, initialValues,
	submitFunction, changePassword,
	handleActivate = () => { }, handleDeactivate = () => { }, ...props }: ModalType & CompanyModalType) => {


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





	const handleSubmit = async (data: CompanyType, setSubmitting: any) => {
		setSubmitting(true);

		await submitFunction(data)

		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		company_short_name: yup.string().required(),

		company_main_office_address: yup.string().required(),
		company_subscribe_type: yup.string().required(),
		timezone_id: yup.number().required(),
		company_contact_name: yup.string().required(),
		company_contact_phone: yup.string().required(),
		company_email: yup.string().required().email('E-mail must be valid'),
		company_usdot: yup.string().required(),

		// terminal_adresses: yup.array().of(yup.string().required('Terminal adress is required'))
	});

	if (!initialValues.company_id) {
		initialValues = {
			company_short_name: '',

			company_main_office_address: '',
			company_subscribe_type: '',
			timezone_id: -1,
			company_contact_name: '',
			company_contact_phone: '',
			company_email: '',
			company_usdot: '',

			// terminal_adresses: ['']
		}
	}
	let initialValuesObj = {
		company_short_name: '',

			company_main_office_address: '',
			company_subscribe_type: '',
			timezone_id: -1,
			company_contact_name: '',
			company_contact_phone: '',
			company_email: '',
			company_usdot: '',
	}

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
								<div style={{ marginRight: '15px' }}>{titleText} <span>{initialValues.company_name}</span></div>
							</div>

							{initialValues.company_id &&
								<StyledDefaultButtonSmall
									onClick={async () => {
										if (initialValues.company_status === StatusEnum.ACTIVE)
											await handleDeactivate(initialValues.company_id)
										else
											await handleActivate(initialValues.company_id)

										handleClose()
									}}
								>{initialValues.company_status === StatusEnum.ACTIVE ? "Deactivate" : "Activate"}</StyledDefaultButtonSmall>}
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

											{/* <div>
										<FieldArray name="terminal_adresses" render={arrayHelpers => (
											<div>
												{values.terminal_adresses.map((address: any, counter: any) => (
													<CustomField
														key={counter}
														name={`terminal_adresses.${counter}`}
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
									</div> */}
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
export default EditCompanyModal