import React, { FC, useState, useEffect } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { MenuList, MenuItem, Icon, Box, Button, SvgIcon, createSvgIcon, Typography } from '@material-ui/core'
import useStyles from "./style"
import mapIcon from '../../assets/img/ic_map.svg'
import driverIcon from '../../assets/img/ic_driver.svg'
import vehicleIcon from '../../assets/img/ic_vehicles.svg'
import logsIcon from '../../assets/img/ic_logs.svg'
import eventIcon from '../../assets/img/ic_event.svg'
import eldIcon from '../../assets/img/ic_eld.svg'
import transferIcon from '../../assets/img/ic_transfer.svg'

const UserMenu = (props: any) => {
	const classes = useStyles()
	return (
		<div className={classes.menuList}>
			<MenuList >
				<MenuItem
					component={NavLink}
					to="/units"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={mapIcon} alt="map-icon" className="svgIcon" />
					<p>Units</p>
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/drivers"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={driverIcon} alt="driver-icon" className="svgIcon"/>
					<p>Drivers</p>
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/vehicles"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={vehicleIcon} alt="vehicle-icon" className="svgIcon"/>
					<p>Vehicles</p>
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/logs"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={logsIcon} alt="logs-icon" className="svgIcon"/>					
					<p>Logs</p>
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/driving-event"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={eventIcon} alt="event-icon" className="svgIcon"/>
					<p>Driving events</p>
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/elds"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={eldIcon} alt="eld-icon" className="svgIcon"/>
					<p>ELDs</p>
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/transfer-eld-data"
					className={classes.list__item}
					activeClassName={classes.list__item_active} >
					<img src={transferIcon} alt="transfer-icon" className="svgIcon"/>
					<p>Transfer ELD data</p>
				</MenuItem>
			</MenuList>
			<div className={classes.menu__footer}>© {new Date().getFullYear()} ELD LLC</div>
		</div>
	)
}

export default withRouter(UserMenu);
