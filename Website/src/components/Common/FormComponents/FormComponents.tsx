import React, { useState } from 'react'
import cn from 'classnames'
import { Field, useField, FieldAttributes } from "formik";
import { makeStyles, withStyles, TextField, IconButton, Checkbox, FormControlLabel } from '@material-ui/core'

import { StyledFilledInputSmall, StyledFilledInput } from '../../Common/StyledTableComponents/StyledInputs'

import openEyeIcon from '../../../assets/img/ic_eye_on.svg'
import closedEyeIcon from '../../../assets/img/ic_eye_off.svg'
import deleteIcon from '../../../assets/img/pctg_cancel.svg'


export const useFieldStyles = makeStyles(theme => ({
	form__field: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '4px',
		position: 'relative',
		"& label": {
			color: '#79757D',
			fontSize: '12px',
			lineHeight: '18px',
			marginBottom: '4px',
		},
		"&.field_with_icon input": {
			paddingRight: '40px'
		}
	},
	field_icon: {
		position: 'absolute',
		"&.icon_password": {
			right: '8px',
			top: '18px',
			height: '32px'
		},
		"&.icon_delete": {
			right: '10px',
			top: '28px',
		}
	}
}))


type CustomFieldProps = {
	name: string
	label?: string
	canSeeInputValue?: boolean
	deleteFunc?: () => void
	type?: string
	placeholder?: string
	optional?: boolean
	disabled?: boolean
	Component?: any
}

export const CustomField: React.FC<FieldAttributes<CustomFieldProps>> = (
	{ label, canSeeInputValue, placeholder = "", deleteFunc, optional = false, disabled = false, Component = StyledFilledInputSmall, ...props }) => {
	const classes = useFieldStyles()
	const [field, meta] = useField<CustomFieldProps>(props);

	let errorText = meta.error && meta.touched ? meta.error : "";
	if (errorText.includes(field.name)) {
		errorText = errorText.slice(field.name.length)
		if (!!label)
			errorText = label + errorText 
		else 
			errorText = placeholder + errorText 
	}


	let type = props.type;
	const [passwordVisibilty, setPasswordVisibilty] = useState(false)

	if (canSeeInputValue) {
		if (passwordVisibilty) {
			type = "text"
		} else {
			type = "password"
		}
	}
	const togglePasswordVisibilty = () => {
		setPasswordVisibilty(!passwordVisibilty)
	}

	let deleteButton
	if (deleteFunc) {
		deleteButton =
			<button
				type="button"
				onClick={deleteFunc}
				className={cn(classes.field_icon, "icon_delete")}
			>
				<img src={deleteIcon} alt="delete-icon" />
			</button>
	}

	let showPasswordButton
	if (canSeeInputValue) {
		showPasswordButton =
			<button
				type="button"
				onClick={togglePasswordVisibilty}
				className={cn(classes.field_icon, "icon_password")}
			>
				<img src={passwordVisibilty ? openEyeIcon : closedEyeIcon} alt="notice-img" />
			</button>
	}

	let fieldClass = classes.form__field
	if (deleteFunc || canSeeInputValue) {
		fieldClass = cn(classes.form__field, "field_with_icon")
	}
	let multiline = false
	if (type === 'textarea') {
		multiline = true
	}
	let helperText
	if (optional && errorText === "") {
		helperText = 'Optional'
	} else {
		helperText = errorText
	}
	let style = {}
	if (helperText === '') {
		style = { marginBottom: '24px' }
	}
	
	return (
		<div className={fieldClass}>
			<label>{label}</label>
			<Component
				{...field}
				multiline={multiline}
				type={type}
				placeholder={placeholder}
				helperText={helperText}
				error={!!errorText}
				style={style}
				disabled={disabled}
			/>

			{deleteButton}

			{showPasswordButton}

		</div>
	)
}

export const CustomCheckBox: React.FC<FieldAttributes<CustomFieldProps>> = ({ ...props }) => {
	const classes = makeStyles(theme => ({
		root: {
			"& .MuiFormControlLabel-label": {
				fontSize: '14px',
				lineHeight: '21px',
				color: '#323033',
			}
		}
	}))()

	return (
		<FormControlLabel
			className={classes.root}
			name={props.name}
			control={<Field name={props.name} color="primary" as={Checkbox} />}
			label={props.label}
		/>
	)
}