import React, { FC, useState, useEffect } from 'react'
import { Paper, TableHead, TableRow, TableBody, makeStyles } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'
import { colors } from '../../assets/scss/Colors/Colors'
import { BarChart } from './Charts'

type PropsType = {
	rows: Array<any>
}

const DashboardTable: FC<PropsType> = ({ rows, ...props }) => {
	let labels = [
		{ label: "Plans" },
		{ label: "Estimate Profit" },
		{ label: "Companies", align: 'right' },
		{ label: "Price", align: 'right' },
	]

	const classes = makeStyles(theme => ({
		root: {
			"& .MuiTableCell-root": {
				border: 'none',
				padding: 0,
				paddingTop: '11px',
				fontFamily: 'Heebo Medium',
				letterSpacing: '0.5px',
				textTransform: 'uppercase',
				color: colors.primary_text_color,
				minWidth: '70px',
				"& span": {
					color: colors.placholder_text_color
				},
				"&.cell__chart": {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					maxWidth: '380px',
					"& canvas": {
						height: '25px!important'
					}
				}
			}
		}

	}))()

	const [maxValue, setMaxValue] = useState(0)
	useEffect(() => {
		let maxProfit = rows[0].profit
		rows.map(row => {
			if (row.profit > maxProfit)
				maxProfit = row.profit
		})
		setMaxValue(maxProfit)
	}, [rows]);

	return (
		maxValue !== 0 ?
		<Paper style={{ boxShadow: 'none', marginTop: '15px' }}>
			<CustomTable subtractHeight={0}>
				<TableHead>
					<TableRow className={classes.root}>
						<CustomTableHeaderCells labels={labels} />
					</TableRow>
				</TableHead>


				<TableBody>
					{rows.map((row, counter) => (
						<TableRow key={row.id} className={classes.root}>
							<StyledTableCell style ={{ fontFamily: 'Heebo Bold' }}> <span>{counter + 1}</span> {row.plan}</StyledTableCell>
							<StyledTableCell className="cell__chart">
								<BarChart
									value={row.profit}
									title={row.plan}
									maxValue={maxValue}
								/>
								<p>${row.profit.toLocaleString()}</p>
							</StyledTableCell>
							<StyledTableCell align={'right'}>{row.companies_count}</StyledTableCell>
							<StyledTableCell align={'right'}>${row.price.toLocaleString()}</StyledTableCell>
						</TableRow>
					))}
				</TableBody>
			</CustomTable>

		</Paper> : <></>
	)
}

export default DashboardTable;
