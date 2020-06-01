import React, { FC, useState, useEffect } from 'react'
import StatusLabel from '../../Common/StatusLabel/StatusLabel'
import s from './Log.module.scss'
import classNames from 'classnames'

import licenseIcon from '../../../assets/img/pctg_license.svg'
import vehicleIcon from '../../../assets/img/pctg_vehicle.svg'
import phoneIcon from '../../../assets/img/pctg_phone.svg'
import emailIcon from '../../../assets/img/pctg_email.svg'

import { RolesEnum } from '../../../types/user'
import { StyledDefaultButtonSmall, StyledConfirmButtonSmall } from '../../Common/StyledTableComponents/StyledButtons'

type PropsType = {
	// driver: DriverType
	loggedUserId: number
	setModalData: (obj: any) => void
	setEditModalOpen: (value: boolean) => void
}

const PreviewBlock: FC<PropsType> = ({ loggedUserId, setModalData, setEditModalOpen, ...props }) => {
	return (
		<div className={s.logPreview}>
			<div className={s.preview__content}>
				<div className={s.preview__header}>
					<div className={s.header__title}>
						<h1 className={s.header__name}>Bartholomew Henry Allen</h1>
						<StatusLabel text="on duty" />
					</div>

					<div className={s.header__buttons}>
						<StyledDefaultButtonSmall variant="outlined" onClick={() => { setEditModalOpen(true) }}>Edit</StyledDefaultButtonSmall>
						<StyledDefaultButtonSmall variant="outlined" onClick={() => { console.log("DOWNLOAD") }}>Download</StyledDefaultButtonSmall>
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
			</div>
			{loggedUserId === RolesEnum.admin &&
				<div className={s.preview__admin_buttons}>
					<div className={s.buttons__scripts}>
						<StyledDefaultButtonSmall>Apply Script 1</StyledDefaultButtonSmall>
						<StyledDefaultButtonSmall>Apply Script 2</StyledDefaultButtonSmall>
						<StyledDefaultButtonSmall>Apply Script 3</StyledDefaultButtonSmall>
					</div>
					<StyledConfirmButtonSmall>Apply</StyledConfirmButtonSmall>
				</div>}
		</div>
	)
}

export default PreviewBlock;
