import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import { useStyles } from './ProfileModalsStyle'
import { ProfileModalType } from './ProfileModalsTypes'

import ChangePasswordModal from './ChangePasswordModal'

const SubscribtionModal = ({ open, handleClose, ...props }: ProfileModalType) => {
	const classes = useStyles();


	const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
	const handleChangePasswordModalClose = () => {
		setChangePasswordModalOpen(false);
	};
	return (
		<React.Fragment>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={open}
				onClose={handleClose}
				aria-labelledby="subscribtion-dialog-title"
			>
				<DialogTitle id="subscribtion-dialog-title"></DialogTitle>
				<DialogContent>
					

					
				</DialogContent>

				<DialogActions>
					<Button onClick={ () => { setChangePasswordModalOpen(true) }} color="primary">Close</Button>
					<Button onClick={handleClose} color="primary">Close</Button>
				</DialogActions>
			</Dialog>

			<ChangePasswordModal open={changePasswordModalOpen} handleClose={handleChangePasswordModalClose}/>
		</React.Fragment>
	);
}
export default SubscribtionModal