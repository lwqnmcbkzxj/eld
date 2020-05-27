import React, { FC, useState, useEffect } from 'react'
import './StatusLabel.scss'

import { StatusEnum } from '../../../types/types'

type PropsType = {
	text?: StatusEnum
}

const StatusLabel: FC<PropsType> = ({ text = "", ...props }) => {
	let theme = "error"
	if (text === StatusEnum.Active) {
		theme = "success"
	} else if (text === StatusEnum.Deactivated) {
		theme = "error"
	}
	return (
		<div className={`status-label` + ' ' + theme}>{text}</div>
	)
}

export default StatusLabel;
