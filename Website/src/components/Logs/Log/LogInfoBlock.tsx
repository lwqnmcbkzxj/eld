import React, { FC, useState, useEffect } from 'react'
import { IconButton } from '@material-ui/core'
import s from './Log.module.scss'
import classNames from 'classnames'

import ViewTable from '../../Common/ViewTable/ViewTable'
		
import iconArrowBottom from '../../../assets/img/ic_arrow_bottom.svg'
import iconArrowUp from '../../../assets/img/ic_arrow_up.svg'


type PropsType = {
	// driver: DriverType
}

const InfoBlock: FC<PropsType> = ({ ...props }) => {
	const [blockVisibility, setBlockVisibility] = useState(true)
	const toggleBlockVisibility = () => {
		setBlockVisibility(!blockVisibility)
	}

	let profileLabels = [
		{ label: 'Driver', name: 'driver_name' },
		{ label: 'Carrier', name: 'carrier' },
		{ label: 'Main Office', name: 'main_office' },
		{ label: 'Home Terminal', name: 'home_terminal' },
		{ label: 'From Address', name: 'from_address' },
		{ label: 'To Address', name: 'to_address' },
		{ label: 'Shipping Docs', name: 'shipping_docs' },
		{ label: 'Co-Driver', name: 'co_dirver' },
		{ label: 'Vehicles', name: 'vehicles' },
		{ label: 'VIN', name: 'vin' },
		{ label: 'Trailers', name: 'trailers' },
		{ label: 'Distance', name: 'distance' },
		{ label: 'Notes', name: 'note' },
	]

	let profileDate = [
		{
			driver_name: 'Bartholomew Henry Allen',
			carrier: 'CARACAS TRANSPORTATION INC',
			main_office: '2400 Hassel Road, #400 Hoffman Estates, IL 60169',
			home_terminal: '2400 Hassel Road, #400 Hoffman Estates, IL 60169',
			from_address: 'Tacoma, WA',
			to_address: 'Tacoma, WA',
			shipping_docs: '000115648464m',
			co_dirver: 'None',
			vehicles: '054',
			vin: '9OJFEJIOFIW54WEFWF',
			trailers: '0777',
			distance: '10 500 mi',
			note: 'sad asd qw dsad as',
		}
	]

	return (
		<div className={s.logsInfoTable}>
			<ViewTable
				tableTitle={'Profile form'}
				labels={profileLabels}
				rows={profileDate}
				tableVisible={blockVisibility}
			/>
			<ViewTable
				rightComponent={<IconButton onClick={toggleBlockVisibility} ><img src={ blockVisibility ? iconArrowUp : iconArrowBottom} alt="arrow-icon"/></IconButton>}
				tableTitle={'Signature'}
				labels={[]}
				rows={[]}
				tableVisible={blockVisibility}
			/>

		</div>
	)
}

export default InfoBlock;
