import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useStyles } from '../ModalsStyle'

import { ModalType } from '../ModalsTypes'
import { colors } from '../../../../assets/scss/Colors/Colors';
import { Formik, Field, Form, FieldArray } from 'formik';
import { CustomField } from '../../FormComponents/FormComponents';

import { StyledFilledInputSmall } from '../../StyledTableComponents/StyledInputs'
import ChangePasswordModal from '../ProfileModals/ChangePasswordModal'
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';

import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";



type CompanyModalType = {
	initialValues: any
	titleText: string
}

const EditCompanyModal = ({ open, handleClose, titleText, initialValues, ...props }: ModalType & CompanyModalType) => {
	const classes = useStyles();

	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};

	const handleSubmit = (data: any, setSubmitting: any) => {
		setSubmitting(true);
		// make async call
		console.log("submit: ", data);
		setSubmitting(false);
		handleClose()
	}

	const validationSchema = yup.object({
		company_name: yup.string().required(),

		company_address: yup.string().required(),
		subscribe_type: yup.string().required(),
		company_timezone: yup.string().required(),
		contact_name: yup.string().required(),
		contact_phone: yup.string().required(),
		email: yup.string().required().email('E-mail must be valid'),
		usdot: yup.string().required(),

		terminal_adresses: yup.array().of(yup.string().required('Terminal adress is required'))
	});

	if (!initialValues.id) {
		initialValues = {
			company_name: '',

			company_address: '',
			subscribe_type: '',
			company_timezone: '',
			contact_name: '',
			contact_phone: '',
			email: '',
			usdot: '',

			terminal_adresses: ['']
		}
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


				<DialogTitle id="edit-company-dialog-title" className={classes.dialog__header}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
						<div style={{ marginRight: '15px' }}>{titleText} <span>{initialValues.company_name}</span></div>
					</div>

					{initialValues.id &&
						<StyledDefaultButtonSmall
							onClick={() => {
								console.log('DEACTIVATING ' + initialValues.id);
								handleClose()
							}}
						>Deactivate</StyledDefaultButtonSmall>}
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

					{({ values, isSubmitting }) => (
						<Form>
							<DialogContent className={classes.dialog__content}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '64px' }}>
									<div>
										<CustomField name={'company_name'} label={'Company Name'} />
										<CustomField name={'company_address'} label={'Company Address'} />

										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'subscribe_type'} label={'Subscribe Type'} />
											<CustomField name={'company_timezone'} label={'Company Timezone'} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'contact_name'} label={'Contact Name'} />
											<CustomField name={'contact_phone'} label={'Contact Phone No.'} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'email'} label={'E-mail'} />
											<CustomField name={'usdot'} label={'USDOT'} />
										</div>
									</div>

									<div>
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

			<ChangePasswordModal open={changePasswordModalOpen} handleClose={handleChangePasswordModalClose} />

		</React.Fragment>
	);
}
export default EditCompanyModal