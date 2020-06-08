import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { useDispatch } from 'react-redux';

import { Field, useField, FieldAttributes } from "formik";
import { makeStyles, FormControl, Select, MenuItem, Checkbox, FormControlLabel, Radio, FormHelperText, TextField } from '@material-ui/core'

import { StyledFilledInputSmall, StyledFilledInput } from '../../Common/StyledTableComponents/StyledInputs'

import openEyeIcon from '../../../assets/img/ic_eye_on.svg'
import closedEyeIcon from '../../../assets/img/ic_eye_off.svg'
import deleteIcon from '../../../assets/img/pctg_cancel.svg'
import { SelectorType } from '../../../types/types';

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
			minHeight: '18px',
			marginBottom: '4px',
		},
		"&.field_with_icon input": {
			paddingRight: '40px'
		},
		
	},
	dropdown: {
		"& .MuiInputBase-root": {
			padding: 0,
			"& .MuiSelect-root": {
				paddingLeft: '12px'
			}

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

	values?: Array<SelectorType>
	onValueChange?: (field: string, value: any, shouldValidate?: boolean | undefined) => void
}

export const CustomField: React.FC<FieldAttributes<CustomFieldProps>> = (
	{ label, canSeeInputValue, placeholder = "", deleteFunc, optional = false, disabled = false, Component = StyledFilledInputSmall, values = [], onValueChange, ...props }) => {
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
	if (values.length !== 0) {
		fieldClass = cn(classes.form__field, "dropdown")
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
		style = { marginBottom: '23px' }
	}


	return (
		<div className={fieldClass}>
			{typeof label === "string" &&
				<label>{label}</label> }
			<Component
				{...field}
				multiline={multiline}
				type={type}
				placeholder={placeholder}
				helperText={helperText}
				error={!!errorText}
				style={style}
				disabled={disabled}
				values={values}
				onValueChange={onValueChange}
				field={field}
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
				minHeight: '18px',
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

type DropdownValues = {
	label?: string
	name?: string
	values: Array<{
		value: string
		id: number
	}>
	onValueChange: (field: string, value: any, shouldValidate?: boolean | undefined) => void
	helperText?: string
	error?: boolean
	style?: any
	field?: any
}
export const CustomDropdown: React.FC<DropdownValues> = ({ values, name = "", onValueChange, helperText = "", error = false, style = {}, ...props }) => {
	const classes = makeStyles(theme => ({
		dropdown: {
			"& .MuiInputBase-root": {
				padding: 0,
				"& .MuiSelect-root": {
					paddingLeft: '12px'
				}
	
			},
		},
	}))()
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		onValueChange(name, event.target.value)
	};

	
	return (
		<div>
			<FormControl style={{ width: '100%', ...style }} className={classes.dropdown}>
				<StyledFilledInputSmall
					id={name}
					select
					name={name}
					onChange={handleChange}
					helperText={helperText}
					error={error}
					value={props.field.value !== null ? props.field.value :
						values.length > 0 ? values[0].id : ""}
				>

					{ values.map(value =>
						<MenuItem value={value.id}>
							{value.value}
						</MenuItem>
					)}
				</StyledFilledInputSmall>
			</FormControl>
		</div>
	);
}