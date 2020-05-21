import React, { FC } from 'react';
import { Doughnut, HorizontalBar } from 'react-chartjs-2'
import { colors } from '../../assets/scss/Colors/Colors'

type BarChartType = {
	value: number
	title: string,
	maxValue: number
}

export const BarChart: FC<BarChartType> = ({ title, value, maxValue, ...props }) => {
	const data = {
		labels: [
			title
		],
		datasets: [{
			data: [value],
			backgroundColor: [colors.main_blue_color],
			label: ""
		}]
	}
	const options = {
		responsive: false,
		legend: { display: false },
		title: { display: false },
		labels: { display: false },
		scales: {
			xAxes: [{
				display: false,
				ticks: {
                    beginAtZero:true,
                    min: 0,
                    max: maxValue
				},
			}],
			yAxes: [{
				display: false,
			}]
		},
		animation: { duration: 1500 },
		tooltips: { enabled: false }
		
	}

	return (
		<HorizontalBar
			data={data}
			options={options}
		/>
	);
}

export const DoughnutChart: FC<{ dataProps: Array<any> }> = ({ dataProps, ...props }) => {
	const data = {
		labels: [
			'Active',
			'Inactive',
		],
		datasets: [{
			data: dataProps,
			backgroundColor: [colors.main_blue_color, colors.bg_component_color],
		}]
	};

	const options = {
		responsive: true,
		legend: { display: false },
		title: { display: false },
		animation: { duration: 1500 }
	}

	return (
		<Doughnut
			data={data}
			options={options}
		/>
	);
}
