import React, { FC } from 'react';
import logo from '../../../assets/img/logo.png'
import { Link } from 'react-router-dom'

const Logo: FC = ({ ...props }) => {
	return (
		<Link to="/"><img src={logo} alt="logo"/></Link>
	)
}

export default Logo;