import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType, StatusEnum } from '../../types/types'

import CompaniesTable from './CompaniesTable'
import { CompanyType } from '../../types/companies';
import { getCompaniesFromServer } from '../../redux/companies-reducer';

import { PasswordObjectType } from '../../types/types'

import { toggleCompanyActivation, changeCompanyPassword, addCompany, editCompany } from '../../redux/companies-reducer'

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
		// dispatch(changeCompanyPassword(companyId, passwordObj))
	}

	const addCompanyDispatch = async (company: CompanyType) => {
		await dispatch(addCompany(company))
	}
	const editCompanyDispatch = async (company: CompanyType) => {
		await dispatch(editCompany)
	}

	const activateCompanyDispatch = async (companyId: number) => {
		await dispatch(toggleCompanyActivation(companyId, 'activate'))
	}	
	const deactivateCompanyDispatch = async (companyId: number) => {
		await dispatch(toggleCompanyActivation(companyId, 'deactivate'))
	}


	return (
		<div className="page companies-page">
			<CompaniesTable
				rows={companies}
				changePassword={changeCompanyPasswordDispatch}

				handleAdd={addCompanyDispatch}
				handleEdit={editCompanyDispatch}
			
				handleActivate={activateCompanyDispatch}
				handleDeactivate={deactivateCompanyDispatch}
			/>
		</div>
	)
}

export default CompaniesContainer;