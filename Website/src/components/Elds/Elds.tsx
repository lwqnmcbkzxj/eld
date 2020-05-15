import React, { FC, useState, useEffect } from 'react'
import './Elds.scss'

import { EldType } from '../../types/elds'
import EldsTable from './EldsTable'

type PropsType = {
	elds: Array<EldType>
}

const Elds:FC<PropsType> = ({ elds, ...props }) => {

	return (
		<div className="page elds-page">
			
			
			<EldsTable rows={elds}/>
		</div>
	)
}

export default Elds;
