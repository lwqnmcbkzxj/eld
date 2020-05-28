import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../../Common/StyledTableComponents/StyledTableComponents'
import s from './Driver.module.scss'
import { withRouter, RouteComponentProps } from 'react-router'
import { LabelType } from '../../../types/types'
import { StyledSearchInput } from '../../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../../Common/StyledTableComponents/StyledButtons'

import iconDone from '../../../assets/img/mark_done.svg'
import iconNone from '../../../assets/img/mark_none.svg'
import iconAlert from '../../../assets/img/mark_error.svg'

// import { DriverType } from '../../types/drivers'
import { Link } from 'react-router-dom'

type PropsType = {
	buttonLink?: string
	tableTitle: string
	rows: Array<any>
	labels: Array<LabelType>
}

const DriverTable: FC<PropsType & RouteComponentProps> = ({ tableTitle, rows = [], labels, buttonLink = "", ...props }) => {

	const checkField = (label: LabelType, rowItem: string) => {
		let filedElem

		if (label.name === 'note') {
			filedElem = <div className="text-block">{rowItem}</div>
		} else if (label.name === 'hours_of_service' || label.name === 'form_and_manner') {
			filedElem = (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img src={iconAlert} alt="alert-icon" style={{ marginRight: '5px' }} />
					<p>{rowItem}</p>
				</div>

			)
		} else if (label.name === 'dvir' || label.name === 'trip') {
			filedElem = !!rowItem === true ?
				<img src={iconDone} alt="icon-done" /> :
				<img src={iconNone} alt="icon-none" />
		} else {
			filedElem = rowItem
		}

		return (
			<StyledTableCell align={label.align ? label.align : "left"}>
				{filedElem}
			</StyledTableCell>
		)
	}

	return (
		<Paper style={{ boxShadow: 'none', marginBottom: '20px' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<div className={s.tableHeader}>{tableTitle}</div>
				{buttonLink !== "" &&
					<StyledDefaultButtonSmall variant="outlined" onClick={() => { props.history.push(buttonLink) }}>View logs</StyledDefaultButtonSmall>}
			</Toolbar>

			<CustomTable subtractHeight={52}>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells labels={labels} />
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow key={row.id} hover>
							{labels.map(label => checkField(label, row[label.name]))}
						</TableRow>

					))}
				</TableBody>
			</CustomTable>
		</Paper>
	)
}

export default withRouter(DriverTable);
