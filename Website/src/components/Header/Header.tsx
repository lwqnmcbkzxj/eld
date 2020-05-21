import React, { FC, useState, MouseEvent } from 'react';
import './Header.scss'
import Logo from '../Common/Logo/Logo'
import GoBackBlock from '../Common/GoBackBlock/GoBackBlock'
import { Button } from '@material-ui/core';

import noticeIcon from '../../assets/img/ic_notice.svg'
import userImg from '../../assets/img/pic_profile.png'
import { IconButton } from '@material-ui/core'
import { HeaderMenu } from './HeaderMenu'
import AdminMiddleHeader from './AdminMiddleHeader'
import { UserType } from '../../types/user'
import cn from 'classnames'

type PropsType = {
	pageName: string
	isRootPage: boolean
	userInfo: UserType
}

const Header: FC<PropsType> = ({ pageName, isRootPage, userInfo, ...props }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};


	return (
		<div className="header-holder">
			<div className="header">
				<div className="header__logo"><Logo /></div>
				
				<div className={cn("header__pageName", {"admin": userInfo.role === 1 })}>
					{!isRootPage && <GoBackBlock link={`/${pageName.toLowerCase()}`} />}

					{ userInfo.role === 1 ? <AdminMiddleHeader />  :
						<div className={cn("header__active_link", { "not-root": !isRootPage })}>{pageName}</div> }
				</div>

				<div className="header__user-block user-block">
					<div className="user-block__notifications">
						<IconButton
							style={{ padding: 0 }}
							onClick={() => { console.log('OPEN NOTIFICATIONs') }}>
							<img src={noticeIcon} alt="notice-img" />
						</IconButton>
					</div>

					<Button
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handleClick}
						style={{ display: 'inline-block', marginLeft: '5px', boxSizing: 'border-box', paddingTop: 0, paddingBottom: 0, backgroundColor: 'transparent' }}>

						<div className="user-block__info info" aria-controls="simple-menu" >
							<div className="info_left">
								<div className="info__nickname">Pac Man</div>
								<div className="info__email">pacman@namco.jp</div>
							</div>
							<img src={userImg} alt="user-img" className="info__user-img" />
						</div>
					</Button>
					<HeaderMenu handleClose={handleMenuClose} anchorEl={anchorEl} />


				</div>
			</div>
		</div>
	)
}

export default Header;