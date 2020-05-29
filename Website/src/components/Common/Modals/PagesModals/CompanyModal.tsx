import React, { useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useStyles } from '../ModalsStyle'
import { Formik, Form, FieldArray } from 'formik';

import { ModalType } from '../ModalsTypes'
import { CompanyType } from '../../../../types/companies';

import { CustomField, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall } from '../../StyledTableComponents/StyledButtons';
import { CustomDialogActions } from '../ModalsComponents'
import ChangePasswordModal from '../ProfileModals/ChangePasswordModal'

import * as yup from "yup";
import { PasswordObjectType } from '../../../../types/types'


type CompanyModalType = {
	initialValues: any
	titleText: string

	submitFunction: (company: CompanyType) => void
	changePassword?: (passwordObj: PasswordObjectType) => void
	handleToggleActive?: (comapnyId: number) => void
}

const EditCompanyModal = ({ open, handleClose, titleText, initialValues, submitFunction, changePassword, handleToggleActive, ...props }: ModalType & CompanyModalType) => {
	const classes = useStyles();

	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};

	const handleSubmit = async (data: CompanyType, setSubmitting: any) => {
		setSubmitting(true);
		// make async call

		// await submitFunction(data)

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

					{({ values, isSubmitting, setFieldValue }) => (
						<Form>
							<DialogContent className={classes.dialog__content}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '64px' }}>
									<div>
										<CustomField name={'company_name'} label={'Company Name'} />
										<CustomField name={'company_address'} label={'Company Address'} />

										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField
												name={'subscribe_type'}
												label={'Subscribe Type'}
												Component={CustomDropdown}
												values={[
													{ value: 'Basic', id: 1 },
													{ value: 'Basic2', id: 2 },
													{ value: 'Basic3', id: 3 },
													{ value: 'Basic4', id: 4 },
												]}
												onValueChange={setFieldValue}
											/>
											<CustomField
												name={'company_timezone'}
												label={'Company Timezone'}
												Component={CustomDropdown}
												values={[
													{ value: 'Pacific', id: 1 },
													{ value: 'Pacific2', id: 2 },
													{ value: 'Pacific3', id: 3 },
													{ value: 'Pacific4', id: 4 },
												]}
												onValueChange={setFieldValue}
											/>
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