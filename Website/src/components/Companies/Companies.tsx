import React, { FC, useState, useEffect } from 'react'
import './Companies.scss'
import { CompanyType } from '../../types/companies';
import CompaniesTable from './CompaniesTable'

type PropsType = {
	companies: Array<CompanyType>
}

const Companies: FC<PropsType> = ({ companies, ...props }) => {

	return (
		<div className="page companies-page">
			{/* <CompaniesTable rows={companies}/> */}
		</div>
	)
}

export default Companies;
