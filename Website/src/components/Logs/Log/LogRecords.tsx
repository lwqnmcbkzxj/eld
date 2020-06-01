import React, { FC, useState, useEffect } from 'react'
import StatusLabel from '../../Common/StatusLabel/StatusLabel'
import { IconButton } from '@material-ui/core'

import s from './Log.module.scss'
import classNames from 'classnames'
// import { PreviewChart } from './PreviewChart'

import { RecordType } from '../../../types/logs'
import SimpleTable from '../../Common/SimpleTable/SimpleTable'
import { LabelType } from '../../../types/types'
import RecordsTimeLine from './RecordsTimeLine'

import violationIcon from '../../../assets/img/mark_error.svg'

type PropsType = {
	// driver: DriverType

	recordsValues: Array<RecordType>
	recordsLabels: Array<LabelType>
	additionalButton?: () => void
	doubleClickFunction?: () => void
}

const LogRecords: FC<PropsType> = ({ recordsValues, recordsLabels, additionalButton, doubleClickFunction, ...props }) => {

	let dataArr = [
		{
			"record_id": 1,
			"record_type": "OFF_DUTY",
			"record_sub_type": 0,
			"record_location": "4.2 mi NW of Bryansk, 10",
			"record_remark": "",
			"record_start_dt": "2020-04-27T23:38:23.000Z",
			"record_end_dt": "2020-04-28T06:38:23.000Z"
		},
		{
			"record_id": 2,
			"record_type": "ON_DUTY",
			"record_sub_type": 0,
			"record_location": "4.2 mi NW of Bryansk, 10",
			"record_remark": "",
			"record_start_dt": "2020-04-28T06:38:23.000Z",
			"record_end_dt": "2020-04-28T12:38:23.000Z",
		},
		{
			"record_id": 3,
			"record_type": "DRIVING",
			"record_sub_type": 0,
			"record_location": "4.2 mi NW of Bryansk, 10",
			"record_remark": "",
			"record_start_dt": "2020-04-28T12:38:23.000Z",
			"record_end_dt": "2020-04-28T16:38:23.000Z",
		},
		{
			"record_id": 4,
			"record_type": "SLEEPER",
			"record_sub_type": 0,
			"record_location": "4.2 mi NW of Bryansk, 10",
			"record_remark": "",
			"record_start_dt": "2020-04-28T16:38:23.000Z",
			"record_end_dt": null
		},
	]









	const [canvasWidth, setCanvasWidth] = useState(0)

	const calcCanvasWidth = () => {
		let blockWidth = document.getElementsByClassName('timeline-chart-block')[0]?.getBoundingClientRect().width

		if (blockWidth) {
			setCanvasWidth(blockWidth - 45)
		}
	}

	useEffect(() => {
		calcCanvasWidth()
		window.addEventListener('resize', calcCanvasWidth);
		return () => {
			window.removeEventListener('resize', calcCanvasWidth);
		};
	}, [])

	const [page, setPage] = useState(1)

	return (
		<div className={s.logRecords}>
			<div className={classNames(s.records__chart, "timeline-chart-block")} id="timeline-chart-block">
				<div className={s.records__header}>
					<div className={s.header__title}>
						Events <span>March 13</span>
					</div>
					<div className={s.paginator}>
						<span>{page} of 21</span>
						<div>
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
								aria-label="previous page"
								className={classNames(s.paginator__item)}
							> {"<"}
							</button>
							<button
								onClick={() => setPage(page + 1)}
								disabled={page === 21}
								aria-label="next page"
								className={classNames(s.paginator__item)}>{">"}
							</button>
						</div>
					</div>
				</div>


				<RecordsTimeLine recordsValues={dataArr} canvasWidth={canvasWidth}/>
				<div className={s.violation}>
				<img src={violationIcon} alt="violation-icon" />
				Violation: 11 - Hour Rule Violations
			</div>
			</div>
			

			<SimpleTable
				rows={recordsValues}
				labels={recordsLabels}
				additionalButton={additionalButton}
				doubleClickFunction={doubleClickFunction}
			/>

			

		</div>
	)
}

export default LogRecords;
