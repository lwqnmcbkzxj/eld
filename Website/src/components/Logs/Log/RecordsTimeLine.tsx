import React, { FC, useState, useEffect } from 'react'
import StatusLabel from '../../Common/StatusLabel/StatusLabel'
import s from './Log.module.scss'
import classNames from 'classnames'

import { RolesEnum } from '../../../types/user'
import { RecordType } from '../../../types/logs'

type PropsType = {
	recordsValues: Array<any>
	canvasWidth: number
	// recordsLabels: Array<LabelType>
}





const RecordsTimeLine: FC<PropsType> = ({ recordsValues, canvasWidth, ...props }) => {
	let typeNames = ['OFF', 'SB', 'DR', 'ON']
	let timeNames = ['10:30', '05:15', '00:00', '02:45']
	let columnsNames = ['M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'N', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'M']

	const [durationLabels, setDurationLabels] = useState([
		{ hours: 0, minutes: 0, seconds: 0 },
		{ hours: 0, minutes: 0, seconds: 0 },
		{ hours: 0, minutes: 0, seconds: 0 },
		{ hours: 0, minutes: 0, seconds: 0 },
	])
	enum durationLablesEnum {
		OFF_DUTY = 0,
		SLEEPER = 1,
		DRIVING = 2,
		ON_DUTY = 3,
	}
	const calculateDuration = (hours: number, minutes: number, seconds: number, type: durationLablesEnum) => {
		let objType = durationLablesEnum[type]
		if (durationLabels[objType as any].seconds + seconds >= 60) {
			minutes = minutes + 1
			seconds = seconds - (60 - durationLabels[objType as any].seconds)
		}
		if (durationLabels[objType as any].minutes + minutes >= 60) {
			hours = hours + 1
			minutes = minutes - (60 - durationLabels[objType as any].minutes)
		}

		let arr = durationLabels
		arr.splice(+durationLablesEnum[type], 0, { hours, minutes, seconds })

		setDurationLabels([...arr])
	}




	let offset = 0
	const drawBackground = (canvas: any) => {
		let ctx = canvas.getContext('2d');

		let width = (canvas.width) - offset
		let colWidth = (width - offset - 80) / 24
		let y = 15
		let x = 0
		let lineHeight = (canvas.height - 20) / 4

		offset = 30
		x = offset

		y = 20

		// GRID
		// small lines
		for (let i = 1; i <= 4; i++) {
			if (i % 2 == 0) {
				ctx.fillStyle = "#F8F7F8";
			} else {
				ctx.fillStyle = "#FFF";
			}
			ctx.fillRect(offset, y, width - 80, y + lineHeight)

			x = offset + colWidth / 4
			ctx.fillStyle = "#D3D2D5";
			for (let j = 0; j < 48; j++) {
				ctx.fillRect(x, y + lineHeight * 0.2, 0.5, lineHeight - lineHeight * 0.3)
				x += colWidth / 2
			}
			y += lineHeight
		}

		// main lines
		x = offset
		y = 20
		ctx.fillStyle = "#D3D2D5";
		for (let i = 0; i < 25; i++) {
			ctx.fillRect(x, y, 1, canvas.height + y)
			x += colWidth
		}

		// additional lines
		x = offset + (colWidth + 2) / 2
		for (let i = 0; i < 24; i++) {
			ctx.fillStyle = "#D3D2D5";
			ctx.fillRect(x, y, 0.5, canvas.height + y)
			x += colWidth
		}
	}

	const drawLabels = (canvas: any) => {
		let ctx = canvas.getContext('2d');

		let width = canvas.width
		let colWidth = (width - 80) / 24
		let y = 15
		let x = 0
		let lineHeight = (canvas.height - 20) / 4

		// LABELS START
		for (let i = 0; i < 4; i++) {
			y += lineHeight

			ctx.font = "12px Heebo Medium, sans-serif";
			ctx.fillStyle = "#000000";
			let textY = y - lineHeight / 2 + 12

			ctx.fillText(typeNames[i], 0, textY);


			let durationText = `${
				durationLabels[i].hours.toString().padStart(2, '0')}:${durationLabels[i].minutes.toString().padStart(2, '0')}`

			ctx.fillText(durationText, width - 30, textY);
		}
		offset = 30
		x = offset

		for (let i = 0; i < 25; i++) {
			if (+columnsNames[i] !== NaN)
				ctx.fillStyle = "#000"; 
			else 
				ctx.fillStyle = "#97939A"; 
				
			ctx.fillText(columnsNames[i], x - columnsNames[i].length * 3, 10);
			x += colWidth
		}
		// LABELS END
	}

	const drawChart = (canvas: any) => {
		let ctx = canvas.getContext('2d');

		let offset = 30
		let x = offset
		let y = 20

		let dayStart = "2020-04-28T00:00:00.000Z"
		let dayEnd = "2020-04-28T23:59:59.999Z"

		// SORTING 
		recordsValues.sort((a, b) => Date.parse(a.record_start_dt) - Date.parse(b.record_start_dt))

		recordsValues.map(dataElement => {
			if (Date.parse(dataElement.record_start_dt) < Date.parse(dayStart)) {
				dataElement.record_start_dt = dayStart
			}
			if (dataElement.record_end_dt && Date.parse(dataElement.record_end_dt) > Date.parse(dayEnd)) {
				dataElement.record_end_dt = dayEnd
			}
		})



		let width = canvas.width
		let colWidth = (width - 80) / 24
		let lineHeight = (canvas.height - 20) / 4

		enum rowsEnum {
			OFF_DUTY = (lineHeight * 1) + 4,
			SLEEPER = (lineHeight * 2) + 4,
			DRIVING = (lineHeight * 3) + 4,
			ON_DUTY = (lineHeight * 4) + 4
		}

		let totalX = 30
		for (let i = 0; i < recordsValues.length; i++) {
			y += lineHeight


			let start = recordsValues[i].record_start_dt as any
			let end
			let isUTC = true
			if (!recordsValues[i].record_end_dt) {
				end = new Date
				isUTC = false
			} else {
				end = recordsValues[i].record_end_dt as any
				isUTC = true
			}


			let date
			let hours
			let minutes
			let seconds

			date = new Date(Date.parse(end) - Date.parse(start))
			if (isUTC) {
				hours = date.getUTCHours()
				minutes = date.getUTCMinutes()
				seconds = date.getUTCSeconds()
			} else {
				hours = date.getHours()
				minutes = date.getMinutes()
				seconds = date.getSeconds()
			}


			let totalMultiplayer = hours + minutes / 60 + seconds / 60 / 60
			calculateDuration(hours, minutes, seconds, recordsValues[i].record_type)


			let xWidth = totalMultiplayer * colWidth

			if (!recordsValues[i].record_end_dt)
				ctx.fillStyle = "#E53C22";
			else
				ctx.fillStyle = "#1A66E5";

			let type = recordsValues[i].record_type as any
			let yLoc = rowsEnum[type]


			ctx.fillRect(totalX, yLoc, xWidth, 4)

			// Drawing vetical line
			if (i > 0) {
				let currentType = type as any
				let lastType = recordsValues[i - 1].record_type as any

				let currentY = rowsEnum[currentType] as any
				let nextY = rowsEnum[lastType] as any

				let yHeight = currentY - nextY
				let start = 0
				let end = 0
				if (yHeight < 0) {
					start = currentY + 4
					end = nextY - currentY
				} else {
					end = currentY - nextY
					start = nextY
				}

				ctx.fillStyle = "#1A66E5";
				ctx.fillRect(totalX, start, 4, end)
			}


			totalX += xWidth
		}






	}



	const onDraw = (canvas: any) => {
		let ctx = canvas.getContext('2d');

		canvas.width = canvasWidth;
		canvas.height = 150;

		drawBackground(canvas)
		drawChart(canvas)
		drawLabels(canvas)
	}




	useEffect(() => {
		let canvas = document.querySelector('#canvas-timeline') as any;
		onDraw(canvas)
	}, [canvasWidth])

	return (
		<div className={s.recordsTimeLine}>

			<canvas id="canvas-timeline"></canvas>
		</div>
	)
}

export default RecordsTimeLine;
