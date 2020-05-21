import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import Companies from './Companies'
import { CompanyType } from '../../types/companies';
import { getCompaniesFromServer } from '../../redux/companies-reducer';

const CompaniesContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const companies = useSelector<AppStateType, Array<CompanyType>>(state=>state.companies.companies)

	const getCompaniesDispatch = () => {
		dispatch(getCompaniesFromServer())
	}

	useEffect(() => {
		getCompaniesDispatch()

	}, []);
	return (
		<Companies
			companies={companies}
		/>
	)
}

export default CompaniesContainer;