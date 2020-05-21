import React, { FC } from 'react';
import logo from '../../../assets/img/logo.png'
import { Link } from 'react-router-dom'

const Logo: FC<{height?: number}> = ({ height = 48, ...props }) => {
	return (
		<Link to="/"  >
			<img src={logo} alt="logo" style={{ height: height }} />
		</Link>
	)
}

export default Logo;