import React, { FC } from 'react';
import { Doughnut, HorizontalBar } from 'react-chartjs-2'
import { colors } from '../../../assets/scss/Colors/Colors'
import s from './Driver.module.scss'

type ChartType = {
	value: number | string
	label: string,
	maxValue: number
}

export const PreviewChart: FC<ChartType> = ({ value, maxValue, label, ...props }) => {
	const data = {
		datasets: [{
			data: [value, maxValue - +value],
			backgroundColor: [colors.main_blue_color, colors.bg_component_color],
		}]
	};



	const options = {
		cutoutPercentage: 80,
		responsive: false,
		circumference: Math.PI / 0.7,
		rotation: Math.PI / 1.27,
		legend: { display: false },
		title: { display: false },
		animation: { duration: 1500 },
		tooltips: { enabled: false },
		labels: { display: false },
		centerText: {
			display: true,
			text: `${value}`,
			fontFamily: 'Roboto',
		}
	}
	function drawTotals(chart: any) {
		let width = chart.chart.width,
			height = chart.chart.height,
			ctx = chart.chart.ctx;

		ctx.restore();
		let fontSize = (height / 64).toFixed(2);
		ctx.font = fontSize + "em sans-serif";
		ctx.fontWeight = 'bold';
		ctx.fontFamily = "Heebo Bold";
		ctx.color = "#323033";
		ctx.textBaseline = "middle";

		let text = chart.options.centerText.text,
			textX = Math.round((width - ctx.measureText(text).width) / 2)

		let textY = (height / 1.7).toFixed(2)

		ctx.fillText(text, textX, textY);
		ctx.save();
	}
	return (
		<div className={s.chartBlock}>
			<Doughnut
				data={data}
				options={options}
				plugins={[{
					beforeDraw: function (chart: any) {
						if (chart.options.centerText.display !== null &&
							typeof chart.options.centerText.display !== 'undefined' &&
							chart.options.centerText.display) {
							drawTotals(chart);
						}
					},
				}]}
			/>
			<div className={s.chartLabel}>{label}</div>
		</div>
	);
}
