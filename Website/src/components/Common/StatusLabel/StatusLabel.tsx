import React, { FC, useState, useEffect } from 'react'
import './StatusLabel.scss'
import { Tooltip, withStyles } from '@material-ui/core'

import { StatusEnum } from '../../../types/types'

type PropsType = {
	text: StatusEnum | string
	description?: string
}


const StyledTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: '#323033',
		fontSize: '14px',
		maxWidth: 400,
	},
	arrow: {
		color: '#323033',
	},
  }))(Tooltip);

const checkText = (text: string, values: Array<StatusEnum>) => {
	for (let i = 0; i < values.length; i++) {
		if (text === values[i]) {
			return true
		}
	}
	return false

}

const StatusLabel: FC<PropsType> = ({ text = "", description = "", ...props }) => {
	let theme = "error"
	if (checkText(text, [StatusEnum.ACTIVE, StatusEnum.DRIVING, StatusEnum.NO_DEFECTS, ])) {
		theme = "success"
	} else if (checkText(text, [StatusEnum.DELETED, StatusEnum.Deactivated, StatusEnum.HAS_DEFECTS, StatusEnum.OFF_DUTY])) {
		theme = "error"
	} else if (checkText(text, [StatusEnum.ON_DUTY])) {
		theme = "warning"
	} else if (checkText(text, [StatusEnum.SLEEPER])) {
		theme = "neutral"
	}


	return (
		<StyledTooltip title={description} arrow>
			<div className={`status-label` + ' ' + theme}>{text.toUpperCase()}</div>
		</StyledTooltip>
	)
}

export default StatusLabel;
