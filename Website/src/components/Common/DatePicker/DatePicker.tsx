import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { colors } from '../../../assets/scss/Colors/Colors'
import MomentUtils from '@date-io/moment';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { withStyles, makeStyles } from '@material-ui/core';
import { StyledFilledInputSmall } from '../StyledTableComponents/StyledInputs';
import moment from 'moment'

export const StyledKeyboardDatePicker = withStyles((theme) => ({
	root: {
		margin: 0,
		width: '152px',
		"& input": {
			paddingRight: '0px!important',
		},
		"& .MuiFormHelperText-root": {
			position: 'absolute',
			bottom: '-20px'
		},
	},
}))(KeyboardDatePicker);

export const useDatePickerStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'relative',

		"&>div:first-child": {
			marginRight: '8px',
			"&:after": {
				content: '""',
				position: 'absolute',
				width: '8px',
				height: '4px',
				top: '15px',
				right: '-8px',
				background: '#F3F2F3',
			}
		}
	},
}))



export const DatePicker = () => {
	const classes = useDatePickerStyles()

	let startOfMonth = +moment().startOf('month');
	let endOfMonth = +moment().endOf('month');

	const [startDate, setStartDate] = React.useState<Date | null>(new Date(startOfMonth));
	const handleStartDateChange = (date: Date | null) => {
		setStartDate(date);
	};

	const [endDate, setEndDate] = React.useState<Date | null>(new Date(endOfMonth));
	const handleEndDateChange = (date: Date | null) => {
		setEndDate(date);
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>

			<div className={classes.root}>
				<StyledKeyboardDatePicker
					disableToolbar
					variant="inline"
					format="MMMM D, yyyy"
					margin="normal"
					id="start-date-picker-inline"
					value={startDate}
					onChange={handleStartDateChange}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
					TextFieldComponent={StyledFilledInputSmall}
				/>
				<StyledKeyboardDatePicker
					disableToolbar
					variant="inline"
					format="MMMM D, yyyy"
					margin="normal"
					id="end-date-picker-inline"
					value={endDate}
					onChange={handleEndDateChange}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
					TextFieldComponent={StyledFilledInputSmall}
				/>
			</div>

		</MuiPickersUtilsProvider>
	);
}