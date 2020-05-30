import React, { FC, useState, useEffect } from 'react'
import './StatusLabel.scss'
import { Tooltip, withStyles } from '@material-ui/core'

import { StatusEnum } from '../../../types/types'

type PropsType = {
	text?: StatusEnum | string
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

const StatusLabel: FC<PropsType> = ({ text = "", description = "", ...props }) => {
	let theme = "error"
	if (text === StatusEnum.Active || text.toLowerCase() === 'driving' || text.toLowerCase() === 'no defects found') {
		theme = "success"
	} else if (text === StatusEnum.Deactivated || text.toLowerCase() === 'defects found') {
		theme = "error"
	} else if (text.toLowerCase() === 'sleeper') {
		theme = "neutral"
	}
	else if (text.toLowerCase() === 'on duty') {
		theme = "warning"
	} else {
		theme = "error"
	}
	return (


		<StyledTooltip title={description} arrow>
			<div className={`status-label` + ' ' + theme}>{text.toUpperCase()}</div>

		</StyledTooltip>
	)
}

export default StatusLabel;
