import React, { FC, useState, useEffect } from 'react'
import './StatusLabel.scss'

type PropsType = {
	text: string
	theme: string
}

const StatusLabel: FC<PropsType> = ({ text = "", theme ='success', ...props }) => {
	return (
		<div className={`status-label` + ' ' + theme}>{text}</div>
	)
}

export default StatusLabel;
