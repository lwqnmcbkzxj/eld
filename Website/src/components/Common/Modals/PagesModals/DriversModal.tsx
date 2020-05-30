import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Checkbox } from '@material-ui/core';
import { Formik, Field, Form, FieldArray } from 'formik';
import { useStyles } from '../ModalsStyle'
import { useSelector } from 'react-redux';

import { ModalType } from '../ModalsTypes'
import { StatusEnum, AppStateType } from '../../../../types/types';
import { UserType, RolesEnum } from '../../../../types/user';

import { CustomField, CustomCheckBox, CustomDropdown } from '../../FormComponents/FormComponents';
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../StyledTableComponents/StyledButtons';
import StyledLabel from '../../StatusLabel/StatusLabel'
import { CustomDialogActions } from '../ModalsComponents'

import * as yup from "yup";


type DriversModal = {
	initialValues: any
	titleText: string
}

const EditProfileModal = ({ open, handleClose, initialValues, titleText, ...props }: ModalType & DriversModal) => {
	const classes = useStyles();
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)

	const submitProfileEdit = (data: any, setSubmitting: any) => {
		setSubmitting(true);
		// make async call
		console.log("submit: ", data);
		setSubmitting(false);
		// handleClose()
	}

	const validationSchema = yup.object({
		first_name: yup.string().required(),
		last_name: yup.string().required(),
		user_name: yup.string().required(),
		password: yup.string().required().min(8).max(24),
		email: yup.string().email('Email must be valid'),
		phone: yup.string().required(),
		licence_number: yup.string().required(),
		state: yup.string().required(),
		truck_number: yup.string(),
		trailer_number: yup.string(),
		personal_conveyance: yup.boolean().required(),
		yard_move: yup.boolean().required(),
		eld: yup.boolean().required(),
		allow_manual_drive_time: yup.boolean().required(),
		co_driver: yup.string(),
		company: yup.string(),
		home_terminal_address: yup.string(),
		home_termial_timezone: yup.string(),
		notes: yup.string(),
	});

	if (!initialValues.id) {
		initialValues = {
			first_name: "",
			last_name: "",
			user_name: '',
			password: '',
			email: '',
			phone: '',
			licence_number: '',
			state: '',
			truck_number: '',
			trailer_number: '',
			personal_conveyance: false,
			yard_move: false,
			eld: false,
			allow_manual_drive_time: false,
			co_driver: '',
			company: '',
			home_terminal_address: '',
			home_termial_timezone: '',
			notes: '',
		}
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
				<DialogTitle id="edit-driver-dialog-title" className={classes.dialog__header}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: "flex-start" }}>
						<div style={{ marginRight: '15px' }}>{titleText} <span>{initialValues.first_name + ' ' + initialValues.last_name} </span></div>
						{initialValues.id && <StyledLabel text={StatusEnum.Active} />}
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
											<CustomField name={'user_name'} label={'Username'} />
											<CustomField name={'password'} label={'Password'} canSeeInputValue={true} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'email'} label={'Email'} optional={true} />
											<CustomField name={'phone'} label={'Phone No.'} />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomField name={'licence_number'} label={'Driver’s Licence No.'} />

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

											<CustomField
												name={'truck_number'}
												label={'Truck No.'}
												Component={CustomDropdown}
												values={[
													{ value: '043', id: 1 },
													{ value: '044', id: 2 },
													{ value: '045', id: 3 },
													{ value: '046', id: 4 },
												]}
												onValueChange={setFieldValue}
												optional={true}
											/>

											<CustomField name={'trailer_number'} label={'Trailer No.'} optional={true} />

										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomCheckBox name="personal_conveyance" label="Personal Conveyance" />
											<CustomCheckBox name="yard_move" label="Yard move" />
										</div>
										<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '32px' }}>
											<CustomCheckBox name="eld" label="ELD (no exemption)" />
											<CustomCheckBox name="allow_manual_drive_time" label="Allow Manual Drive Time" />
										</div>
									</div>

									<div>
										<CustomField
											name={'co_driver'}
											label={'Co-Driver'}
											Component={CustomDropdown}
											values={[
												{ value: 'Donald Duck', id: 1 },
												{ value: 'Donald Duck', id: 2 },
												{ value: 'Donald Duck', id: 3 },
												{ value: 'Donald Duck', id: 4 },
											]}
											onValueChange={setFieldValue}
											optional={true}
										/>

										{loggedUser.role_id === RolesEnum.admin &&
											<CustomField
												name={'company'}
												label={'Company'}
												Component={CustomDropdown}
												values={[
													{ value: 'FedEx', id: 1 },
													{ value: 'FedEx', id: 2 },
													{ value: 'FedEx', id: 3 },
													{ value: 'FedEx', id: 4 },
												]}
												onValueChange={setFieldValue}
												optional={true}
											/>

										}

										<CustomField
											name={'home_terminal_address'}
											label={'Home Terminal Address'}
											Component={CustomDropdown}
											values={[
												{ value: '2400 Hassel Road, #400 Hoffman Estates, IL 60169', id: 1 },
												{ value: '2400 Hassel Road, #400 Hoffman Estates, IL 60169', id: 2 },
											]}
											onValueChange={setFieldValue}
											optional={true}
										/>
										<CustomField
											name={'home_termial_timezone'}
											label={'Home Terminal Timezone'}
											Component={CustomDropdown}
											values={[
												{ value: 'Central Standart Time', id: 1 },
												{ value: 'Central Standart Time', id: 2 },
											]}
											onValueChange={setFieldValue}
											optional={true}
										/>

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
export default EditProfileModal