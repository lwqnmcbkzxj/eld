import React from 'react';
import { Menu, MenuItem, makeStyles, Button } from '@material-ui/core';
import { colors } from '../../assets/scss/Colors/Colors';


type HeaderMenuProps = {
	anchorEl: null | HTMLElement
	handleClose: () => void
}
const useStyles = makeStyles(theme => ({
	menu__item: {
		width: '180px',
		color: colors.primary_text_color
	},
}));



export const HeaderMenu: React.FC<HeaderMenuProps> = ({ anchorEl, handleClose, ...props }) => {
	const classes = useStyles()
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
					onClick={handleClose}>
					Edit Profile
				</MenuItem>

				<MenuItem
					className={classes.menu__item}
					onClick={handleClose}>
					Subscription
					</MenuItem>
				<MenuItem
					className={classes.menu__item}
					onClick={handleClose}>
					Log out
				</MenuItem>
			</Menu>
		</div>
	);
}