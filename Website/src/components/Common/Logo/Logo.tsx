import React, { FC } from 'react';
import logo from '../../../assets/img/logo.png'
import { Link } from 'react-router-dom'

const Logo: FC<{height?: number}> = ({ height = 48, ...props }) => {
	return (
		<Link to="/" style={{ height: height }} ><img src={logo} alt="logo"/></Link>
	)
}

export default Logo;