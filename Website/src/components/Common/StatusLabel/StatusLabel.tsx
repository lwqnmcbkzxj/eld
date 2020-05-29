import React, { FC, useState, useEffect } from 'react'
import './StatusLabel.scss'

import { StatusEnum } from '../../../types/types'

type PropsType = {
	text?: StatusEnum | string
}

const StatusLabel: FC<PropsType> = ({ text = "", ...props }) => {
	let theme = "error"
	if (text === StatusEnum.Active || text.toLowerCase() === 'driving') {
		theme = "success"
	} else if (text === StatusEnum.Deactivated) {
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
		<div className={`status-label` + ' ' + theme}>{text.toUpperCase()}</div>
	)
}

export default StatusLabel;
