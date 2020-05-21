import React from 'react';
import './Dashboard.scss'
import { Box } from '@material-ui/core';
import { DoughnutChart } from './Charts';
import DashboardTable from './DashboardTable'

const dashboardTableArr = [ 
	{
		id: 1,
		plan: 'Basic',
		profit: 5000,
		companies_count: 500,
		price: 10
	},
	{
		id: 2,
		plan: 'Advanced',
		profit: 2500,
		companies_count: 50,
		price: 50
	},
	{
		id: 3,
		plan: 'Premium',
		profit: 1000,
		companies_count: 100,
		price: 100
	}
]


const Dashboard = () => {
	return (
		<div className="page dashboard-page">

			<div className="dashboard-page_block block">
				<div className="block__holder">
					<div className="block__header">
						<div className="header__title">Finance planning</div>
						<div className="header__quantity">${(13500).toLocaleString()}</div>
					</div>
					<DashboardTable rows={dashboardTableArr}/>
				</div>
			</div>

			<div className="dashboard-page_block block">

				<div className="block__holder">
					<div className="block__header">
						<div className="header__title">active company count</div>
						<div className="header__quantity">${(50).toLocaleString()}</div>
					</div>
					<DoughnutChart dataProps={[5,1]}/>
				</div>


				<div className="block__holder">
					<div className="block__header">
						<div className="header__title">active unit count</div>
						<div className="header__quantity">${(4999).toLocaleString()}</div>
					</div>
					<DoughnutChart dataProps={[5,1]}/>
				</div>
			</div>
		</div>
	);
}
export default Dashboard; 