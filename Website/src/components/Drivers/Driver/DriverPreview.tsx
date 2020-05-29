import React, { FC, useState, useEffect } from 'react'
import s from './Driver.module.scss'
import classNames from 'classnames'

import { RolesEnum } from '../../../types/user'

import licenseIcon from '../../../assets/img/pctg_license.svg'
import vehicleIcon from '../../../assets/img/pctg_vehicle.svg'
import phoneIcon from '../../../assets/img/pctg_phone.svg'
import emailIcon from '../../../assets/img/pctg_email.svg'

import { PreviewChart } from './PreviewChart'
import StatusLabel from '../../Common/StatusLabel/StatusLabel'
import { StyledDefaultButtonSmall } from '../../Common/StyledTableComponents/StyledButtons'

type PropsType = {
	// driver: DriverType

	setModalData: (obj: any) => void
	setEditModalOpen: (value: boolean) => void
}

const DriverPreview: FC<PropsType> = ({ setModalData, setEditModalOpen, ...props }) => {
	let values = [
		{ label: 'break', value: 10 },
		{ label: 'driving', value: 20 },
		{ label: 'shift', value: 30 },
		{ label: 'cycle', value: 40 },
	]
	let maxValue = 40

	return (
		<div className={s.driverPreview}>
			<div className={s.preview__header}>
				<div className={s.header__title}>
					<h1 className={s.header__name}>Bartholomew Henry Allen</h1>
					<StatusLabel text="on duty" />
				</div>

				<div className={s.header__buttons}>
					<StyledDefaultButtonSmall variant="outlined" onClick={() => { setEditModalOpen(true) }}>Edit</StyledDefaultButtonSmall>
				</div>

			</div>
			<div className={s.preview__info}>
				<div className={s.info__element}>
					<img src={licenseIcon} alt="license-icon" />
					<p>Y8177257</p>
				</div>
				<div className={s.info__element}>
					<img src={vehicleIcon} alt="vehicle-icon" />
					<p>012</p>
				</div>
				<div className={s.info__element}>
					<img src={phoneIcon} alt="phone-icon" />
					<p>+1 (302) 894-6596</p>
				</div>
				<div className={s.info__element}>
					<img src={emailIcon} alt="email-icon" />
					<p>flash@dc.com</p>
				</div>
			</div>
			<div className={s.preview__stats}>
				<div className={s.stats__charts}>
					{values.map((value, counter) =>
						<PreviewChart
							key={counter}
							maxValue={maxValue}
							value={value.value}
							label={value.label}
						/>)}

				</div>

				<div className={s.stats__info}>
					<div className={s.info__element}>
						<div className={s.element__count}>9:55</div>
						<div className={s.element__text}>Worked Today</div>
					</div>
					<div className={s.info__element}>
						<div className={classNames(s.element__count, s.error)}>2</div>
						<div className={s.element__text}>{"Errors & Violation"}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DriverPreview;
