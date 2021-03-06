import React, { FC, useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MenuList, MenuItem, Icon, Box } from '@material-ui/core'
import useStyles from "./style"

import dashBoardIcon from '../../assets/img/ic_dashboard.svg'
import companiesIcon from '../../assets/img/ic_companies.svg'
import plansIcon from '../../assets/img/ic_accounting.svg'
import accountingIcon from '../../assets/img/ic_accounting.svg'
import settingsIcon from '../../assets/img/ic_settings.svg'

const AdminMenu = (props: any) => {
	const classes = useStyles()

	return (
		<div className={classes.menu}>
			<div className={classes.menuList}>
				<MenuList >
					<MenuItem
						component={NavLink}
						to="/dashboard"
						className={classes.list__item}
						activeClassName={classes.list__item_active} >
						<img src={dashBoardIcon} alt="icon" className="svgIcon" />
						<p>Dashboard</p>
					</MenuItem>
					<MenuItem
						component={NavLink}
						to="/companies"
						className={classes.list__item}
						activeClassName={classes.list__item_active} >
						<img src={companiesIcon} alt="icon" className="svgIcon" />
						<p>Companies</p>
					</MenuItem>
					<MenuItem
						component={NavLink}
						to="/plans"
						className={classes.list__item}
						activeClassName={classes.list__item_active} >
						<img src={plansIcon} alt="icon" className="svgIcon" />
						<p>Plans</p>
					</MenuItem>
					<MenuItem
						component={NavLink}
						to="/accounting"
						className={classes.list__item}
						activeClassName={classes.list__item_active} >
						<img src={accountingIcon} alt="icon" className="svgIcon" />
						<p>Accounting</p>
					</MenuItem>
					<MenuItem
						component={NavLink}
						to="/settings"
						className={classes.list__item}
						activeClassName={classes.list__item_active} >
						<img src={settingsIcon} alt="icon" className="svgIcon" />
						<p>Settings</p>
					</MenuItem>
				</MenuList>
				<div className={classes.menu__footer}>© {new Date().getFullYear()} ELD LLC</div>
			</div>
		</div>
	)
}

export default AdminMenu;
