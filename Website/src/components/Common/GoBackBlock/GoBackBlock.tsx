import React, { FC } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../../types/types'
import { Link } from 'react-router-dom';
import './GoBackBlock.scss'
type PropsType = {
	link: string
}

const GoBackBlock: FC<PropsType> = ({ link, ...props }) => {
	const dispatch = useDispatch()

	return (
		<Link to={link} className="goBackBlock">{"<"}</Link>
	)
}

export default GoBackBlock;