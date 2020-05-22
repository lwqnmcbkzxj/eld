import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { Menu, MenuItem, makeStyles, Button } from '@material-ui/core';
import { colors } from '../../assets/scss/Colors/Colors';

import ProfileSubscriptionModal from '../Common/Modals/ProfileModals/ProfileSubscriptionModal'
import EditProfileModal from '../Common/Modals/ProfileModals/EditProfileModal'

import { logout } from '../../redux/user-reducer'
type HeaderMenuProps = {
	anchorEl: null | HTMLElement
	handleClose: () => void
}
const useStyles = makeStyles(theme => ({
	menu__item: {
		width: '180px',
		color: colors.primary_text_color,
		fontFamily: 'Heebo',
		fontSize: '14px',
		lineheight: '21px',
		textTransform: 'none'
	},
}));



export const HeaderMenu: React.FC<HeaderMenuProps> = ({ anchorEl, handleClose, ...props }) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	// const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
	// const handleSubscriptionModalClose = () => {
	// 	setSubscriptionModalOpen(false);
	// };

	const [profileEditModalOpen, setProfileEditModalOpen] = useState(false)
	const handleProfileEditModalClose = () => {
		setProfileEditModalOpen(false);
	};

	return (
		<div style={{ boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<MenuItem
					className={classes.menu__item}
					onClick={() => {
						setProfileEditModalOpen(true)
						handleClose()
					}}>
					Edit Profile
				</MenuItem>

				{/* <MenuItem
					className={classes.menu__item}
					onClick={() => {
						setSubscriptionModalOpen(true)
						handleClose()
					}}>
					Subscription
					</MenuItem> */}
				<MenuItem
					className={classes.menu__item}
					onClick={() => {
						dispatch(logout())
						handleClose()
					}}>
					Log out
				</MenuItem>
			</Menu>


			{/* <ProfileSubscriptionModal open={subscriptionModalOpen} handleClose={handleSubscriptionModalClose} /> */}
			<EditProfileModal open={profileEditModalOpen} handleClose={handleProfileEditModalClose} />
		</div>
	);
}