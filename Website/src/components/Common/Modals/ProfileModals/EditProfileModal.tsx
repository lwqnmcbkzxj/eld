import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Field, Form, FieldArray } from 'formik';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { UserType } from '../../../../types/user'
import { PasswordObjectType } from '../../../../types/types'

import * as yup from "yup";

import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';

import { StyledFilledInputSmall } from '../../../Common/StyledTableComponents/StyledInputs'
import ChangePasswordModal from './ChangePasswordModal'
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'



type EditProfileType = {
	initialValues: UserType
	changePassword: (passwordObj: PasswordObjectType) => void
	editProfile: (profileObj: UserType) => void
}

const EditProfileModal = ({ open, handleClose, changePassword, editProfile, initialValues, ...props }: ModalType & EditProfileType) => {
	const classes = useStyles();

	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};

	const submitProfileEdit = async (data: any, setSubmitting: any) => {
		setSubmitting(true);

		// await editProfile(data)

		console.log("submit: ", data);
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		first_name: yup.string().required(),
		last_name: yup.string().required(),
		email: yup.string().required().email('Email must be valid'),
		phone: yup.string().required(),
		contact_name: yup.string().required(),
		contact_phone: yup.string().required(),
		usdot: yup.string().required(),
		company_timezone: yup.string().required(),
		company_name: yup.string().required(),
		company_adress: yup.string().required(),
		terminal_adresses: yup.array().of(yup.string().required('Terminal adress is required'))

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
				<DialogTitle id="edit-profile-dialog-title" className={classes.dialog__header}>Edit Profile <span>Pac man</span></DialogTitle>

				<Formik
					validateOnChange={true}
					initialValues={{

						first_name: "Pac",
						last_name: "Man",
						user_login: '',
						email: 'malkovich@mail.ru',
						phone: '+1 (302) 894-6596',
						contact_name: 'Marry',
						contact_phone: '+1 (302) 894-6596',
						usdot: '15864647',
						company_timezone: 'Pacific',
						company_name: 'CARACAS TRANSPORTATION INC',
						company_adress: '2400 Hassel Road, #400 Hoffman Estates, IL 60169',
						terminal_adresses: ['2400 Hassel Road, #400 Hoffman Estates, IL 60169', '2400 Hassel Road, #400 Hoffman Estates, IL 60169']
					}}
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
											<CustomField name={'first_name'} label={'First Name'} />
											<CustomField name={'last_name'} label={'Last Name'} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'email'} label={'E-mail'} />
											<CustomField name={'phone'} label={'Phone No.'} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'contact_name'} label={'Contact Name'} />
											<CustomField name={'contact_phone'} label={'Contact Phone No.'} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'usdot'} label={'USDOT'} />


											<CustomField
												name={'company_timezone'}
												label={'Company Timezone'}
												Component={CustomDropdown}
												values={[
													{ value: 'Central Standart Time', id: 1 },
													{ value: 'Central Standart Time', id: 2 },
												]}
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

									style={{ padding: 0 }}
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