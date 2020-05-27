import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import CompaniesTable from './CompaniesTable'
import { CompanyType } from '../../types/companies';
import { getCompaniesFromServer } from '../../redux/companies-reducer';

import { PasswordObjectType } from '../../types/types'

const CompaniesContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const companies = useSelector<AppStateType, Array<CompanyType>>(state=>state.companies.companies)

	const getCompaniesDispatch = () => {
		dispatch(getCompaniesFromServer())
	}

	useEffect(() => {
		getCompaniesDispatch()

	}, []);


	const changeCompanyPasswordDispatch = (passwordObj: PasswordObjectType) => {
		// dispatch(changeCompanyPassword)
	}

	const addCompanyDispatch = () => {
		// dispatch(editCompany)
	}
	const editCompanyDispatch = () => {
		// dispatch(editCompany)
	}

	const toggleActiveStatusDispatch = (companyId: number) => {
		// dispatch(toggleActiveStatus)
	}

	return (
		<div className="page companies-page">
			<CompaniesTable
				rows={companies}
				changePassword={changeCompanyPasswordDispatch}
				handleAdd={addCompanyDispatch}
				handleEdit={editCompanyDispatch}
				handleToggleActive={toggleActiveStatusDispatch}
			
			/>
		</div>
	)
}

export default CompaniesContainer;