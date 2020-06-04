import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'
import { UserType } from '../../types/user';
import { EldType } from '../../types/elds';

import EldsTable from './EldsTable'
import { getEldsFromServer, addEld, editEld, deleteEld } from '../../redux/elds-reducer';

const EldsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const elds = useSelector<AppStateType, Array<EldType>>(state => state.elds.elds)
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)


	const getElds = () => {
		dispatch(getEldsFromServer(loggedUser.company_id))
	}

	useEffect(() => {
		getElds()
	}, [])

	const addEldDispatch = async (dataObj: EldType) => {
		dataObj.company_id = loggedUser.company_id
		await dispatch(addEld(dataObj))

	}
	const editEldDispatch = async (dataObj: EldType) => {
		await dispatch(editEld(dataObj))
	}
	const deleteEldDispatch = async (id: number) => {
		await dispatch(deleteEld(id, loggedUser.company_id))
	}
	return (

		<div className="page elds-page">
			<EldsTable
				rows={elds}
				handleAdd={addEldDispatch}
				handleEdit={editEldDispatch}
				handleDelete={deleteEldDispatch}
			/>
		</div>

	)
}

export default EldsContainer;