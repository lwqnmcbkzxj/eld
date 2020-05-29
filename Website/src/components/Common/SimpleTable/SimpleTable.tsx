import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, IconButton } from '@material-ui/core';
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../StyledTableComponents/StyledTableComponents'
import s from './SimpleTable.module.scss'
import { withRouter, RouteComponentProps } from 'react-router'
import { LabelType } from '../../../types/types'
import { StyledSearchInput } from '../StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../StyledTableComponents/StyledButtons'
import arrowIcon from '../../../assets/img/ic_arrow_bottom.svg'
import iconDone from '../../../assets/img/mark_done.svg'
import iconNone from '../../../assets/img/mark_none.svg'
import iconAlert from '../../../assets/img/mark_error.svg'

// import { DriverType } from '../../types/drivers'
import { Link } from 'react-router-dom'
import StatusLabel from '../StatusLabel/StatusLabel';

type PropsType = {
	button?: {
		link: string
		text: string
	}

	tableTitle?: string
	rows: Array<any>
	labels: Array<LabelType>
}

const SimpleTable: FC<PropsType & RouteComponentProps> = ({ tableTitle, rows = [], labels, button, ...props }) => {

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
		} else if (label.name === 'dvir' || label.name === 'trip' || label.name === 'driver_signature' || label.name === 'mechanic_signature') {
			filedElem = !!rowItem === true ?
				<img src={iconDone} alt="icon-done" /> :
				<img src={iconNone} alt="icon-none" />
		} else if (label.name === 'status') {
			filedElem = <StatusLabel text={rowItem} />
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
			{tableTitle || button ?
				<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
					<div className={s.tableHeader}>{tableTitle}</div>
					<div>
						{button &&
							<StyledDefaultButtonSmall variant="outlined" onClick={() => { props.history.push(button.link) }}>{button.text}</StyledDefaultButtonSmall>}

						<IconButton><img src={arrowIcon} alt="arrow-icon" /></IconButton>
					</div>

				</Toolbar> : null}

			<CustomTable subtractHeight={52}>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells labels={labels} noSorting={true} />
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

export default withRouter(SimpleTable);
