import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Field, Form, FieldArray } from 'formik';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { UserType } from '../../../../types/user'
import { PasswordObjectType, AppStateType, SelectorType } from '../../../../types/types'

import * as yup from "yup";

import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledFilledInputSmall } from '../../../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'

import ChangePasswordModal from './ChangePasswordModal'
import { getTimezones, getCompanyTerminals } from '../../../../redux/commonData-reducer';


type EditProfileType = {
	initialValues: UserType
	changePassword: (passwordObj: PasswordObjectType) => void
	editProfile: (profileObj: UserType) => void
}

const EditProfileModal = ({ open, handleClose, changePassword, editProfile, initialValues, ...props }: ModalType & EditProfileType) => {
	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};

	const classes = useStyles();
	const dispatch = useDispatch()

	const terminals = useSelector<AppStateType, Array<SelectorType>>(state => state.common.terminals)
	const timezones = useSelector<AppStateType, Array<SelectorType>>(state => state.common.timezones)


	useEffect(() => {
		(async function initModal() {
			if (open) {
				dispatch(getCompanyTerminals(initialValues.company_id))
				dispatch(getTimezones())
			}
		})()
	}, [open]);

	const submitProfileEdit = async (data: UserType, setSubmitting: any) => {
		setSubmitting(true);

		let newDataObj = {} as any

		let key = "" as keyof UserType

		for (key in data) {
			if (data[key] !== initialValues[key] || key === 'user_id') {
				newDataObj[key] = data[key]
			}
		}

		await editProfile(newDataObj)

		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		user_first_name: yup.string().nullable().required(),
		user_last_name: yup.string().nullable().required(),
		user_email: yup.string().nullable().required().email('Email must be valid'),
		user_phone: yup.string().nullable().required(),

		company_contact_name: yup.string().nullable().required(), //
		company_contact_phone: yup.string().nullable().required(), //
		usdot: yup.string().nullable().required(), //

		timezone_id: yup.string().nullable().required(),

		company_name: yup.string().nullable().required(), //
		company_address_text: yup.string().nullable().required(), //

		company_terminal_names: yup.array().of(yup.string().required('Terminal adress is required'))
	});

	const editValidationScema = yup.object({
		user_first_name: yup.string().nullable(),
		user_last_name: yup.string().nullable(),
		user_email: yup.string().nullable().email('Email must be valid'),
		user_phone: yup.string().nullable(),

		company_contact_name: yup.string().nullable(), //
		company_contact_phone: yup.string().nullable(), //
		usdot: yup.string().nullable(), //

		timezone_id: yup.string().nullable(),

		company_name: yup.string().nullable(), //
		company_address_text: yup.string().nullable(), //

		company_terminal_names: yup.array().of(yup.string().required('Terminal adress is required'))
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
				<DialogTitle id="edit-profile-dialog-title" className={classes.dialog__header}>Edit Profile <span>{initialValues.user_first_name} {initialValues.user_last_name}</span></DialogTitle>

				<Formik
					validateOnChange={true}
					initialValues={{
						...initialValues,
						terminal_adresses: [...terminals]
					}}
					validationSchema={initialValues.user_id ? editValidationScema : validationSchema}
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
											<CustomField name={'usdot'} label={'USDOT'} />


											<CustomField
												name={'timezone_id'}
												label={'Company Timezone'}
												Component={CustomDropdown}
												values={timezones}
												onValueChange={setFieldValue}
											/>
										</div>

										<CustomField name={'company_name'} label={'Company Name'} />
									</div>

									<div>
										<CustomField name={'company_adress'} label={'Company Address'} />

										<FieldArray name="terminal_adresses" render={arrayHelpers => (
											<div>
												{values.terminal_adresses && values.terminal_adresses.map((address, counter) => (
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