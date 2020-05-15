import React, { FC, useState, useEffect, Children } from 'react'
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, withStyles, makeStyles, TableContainer, TablePagination, Typography } from '@material-ui/core';
import { colors } from '../../../assets/scss/Colors/Colors';


export const StyledTableCell = withStyles((theme) => ({
	head: {
		color: '#97939A',
		fontSize: ' 12px',
		lineHeight: '18px',
		whiteSpace: 'nowrap',
		background: '#fff'
	},
	body: {
		color: '#323033',
		fontSize: ' 14px',
		lineHeight: '21px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		"& .text-block": {
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			maxWidth: '150px'
		},
	},
}))(TableCell);


export const CustomTable = (props: any) => {
	return (
		<TableContainer style={{ maxHeight: 'calc(100vh - 174px)' }}>
			<Table stickyHeader>
				{props.children}
			</Table>
		</TableContainer>
	)
}


type PaginatorTypes = {
	length: number
	rowsPerPage: number
	page: number
	handleChangePage: (event: unknown, newPage: number) => void
	handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const CustomPaginator: React.FC<PaginatorTypes> = ({ length, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage, ...props }) => {
	let classes = makeStyles(theme => ({
		paginator: {
			position: 'absolute',
			background: colors.bg_white_color,
			bottom: '0px',
			width: '100%',
			zIndex: 5,
			boxShadow: '0px 0px 4px rgba(50, 48, 51, 0.15)',
		}
	}))();

	return (
		<TablePagination
			className={classes.paginator}
			rowsPerPageOptions={[10, 25, 50, 100, 150]}
			component="div"
			count={length}
			rowsPerPage={rowsPerPage}
			page={page}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={handleChangeRowsPerPage}
		/>
	)
}

type TableHeaderCellsProps = {
	labels: Array<{
		label: string
		align?: string
	}>
	Component?: any
}
export const CustomTableHeaderCells: React.FC<TableHeaderCellsProps> = ({ labels, Component, ...props }) => {
	if (!Component)
		Component = StyledTableCell

	return (
		<>
			{
				labels.map((label, counter) => (
					<Component key={counter} align={(label.align === 'right') ? label.align : "left"} >
						{label.label}
					</Component>
				))
			}
		</>
	)
}