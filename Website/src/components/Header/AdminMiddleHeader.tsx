import React, { FC, useState, MouseEvent } from 'react';
import './Header.scss'
import Logo from '../Common/Logo/Logo'
import GoBackBlock from '../Common/GoBackBlock/GoBackBlock'
import { Link } from 'react-router-dom'
import { Tabs, Tab, MenuList, MenuItem, makeStyles } from '@material-ui/core';

import dashboardIcon from '../../assets/img/ic_dashboard.svg'
import companiesIcon from '../../assets/img/ic_companies.svg'
import logsIcon from '../../assets/img/ic_logs.svg'

import cn from 'classnames'
import { colors } from '../../assets/scss/Colors/Colors'





type PropsType = {
}


const AdminMiddleHeader: FC<PropsType> = ({ ...props }) => {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	const classes = makeStyles((theme) => ({
		root: {
			padding: 0,
			"& .MuiButtonBase-root": {
				minHeight: 0,
				textTransform: 'uppercase',
				fontFamily: 'Heebo Medium',
				fontSize: '14px',
				lineHeight: '21px',
				letterSpacing: '0.	5px',
				color: colors.secondary_text_color,
				opacity: 1,
				padding: 0,
				"& .MuiTab-wrapper": {
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				},
				"& .svgIcon": {
					filter: 'none',
					marginBottom: '0px'
				},
				"&.Mui-selected": {
					color: colors.primary_text_color,
					opacity: 1,
					"& .svgIcon": {
						filter: 'invert(35%) sepia(65%) saturate(4721%) hue-rotate(210deg) brightness(92%) contrast(95%)',
					}
				},
			}
		},
	  }))();

	return (
		<>
			<Tabs
				onChange={handleChange}
				value={value}
				indicatorColor="primary"
				className={classes.root}
			>
				<Tab label='dashboard' to='/dashboard' component={Link} icon={<img src={dashboardIcon} alt="" className="svgIcon" />} />
				<Tab label='companies' to='/companies' component={Link} icon={<img src={companiesIcon} alt="" className="svgIcon" />}/>
				<Tab label='logs' to='/logs' component={Link} icon={<img src={logsIcon} alt="" className="svgIcon" />}/>
			</Tabs>
		</>
	)
}

export default AdminMiddleHeader;