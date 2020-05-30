import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, Toolbar, withStyles } from '@material-ui/core';
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../StyledTableComponents/StyledTableComponents'
import { withRouter, RouteComponentProps } from 'react-router'
import { LabelType } from '../../../types/types'

import s from './ViewTable.module.scss'

import errorIcon from '../../../assets/img/mark_error_big.svg'

type PropsType = {
	tableTitle?: string
	rows: Array<any>
	labels: Array<LabelType>
	style?: any
	rightComponent?: any
	tableVisible?: boolean
}

const CustomTableCell = withStyles((theme) => ({
	body: {
		paddingTop: '0',
		paddingBottom: '10px',
		borderBottom: 'none',

		"&.label": {
			color: '#79757D',
		}
	},
}))(StyledTableCell);

const ViewTable: FC<PropsType & RouteComponentProps> = ({ tableTitle, rows = [], labels, style = {}, rightComponent ="", tableVisible = true, ...props }) => {
	return (
		<div style={{ boxShadow: 'none', marginBottom: '20px', ...style }} className={s.viewTable}>
			{tableTitle ?
				<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
					<div className={s.tableHeader}>{tableTitle}</div>
					{rightComponent}
				</Toolbar> : null}


			{tableVisible &&
			
				(
					rows.length === 0 ?

					<div className={s.errorBlock}>
						<img src={errorIcon} alt="error-icon" />
						<p>No {tableTitle}</p>
					</div> :
					<CustomTable>
						<TableBody>
							{labels.map((label, counter) => (
								<TableRow key={counter}>
									<CustomTableCell className={"label"}>{label.label}</CustomTableCell>

									{rows.map(row =>
										<CustomTableCell>{row[label.name]}</CustomTableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</CustomTable>
				)
			}
		</div>
	)
}

export default withRouter(ViewTable);
