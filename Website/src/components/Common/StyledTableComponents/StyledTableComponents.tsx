import React, { FC, useState, useEffect, Children } from 'react'
import { Paper, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, withStyles, makeStyles, TableContainer, TablePagination, Typography, IconButton, createStyles } from '@material-ui/core';
import { colors } from '../../../assets/scss/Colors/Colors';
import { LabelType } from '../../../types/types'
import cn from 'classnames'

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
		fontSize: ' 15px',
		lineHeight: '21px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		"& .text-block": {
			minWidth: '200px',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
	},
}))(TableCell);


export const CustomTable = ({ subtractHeight = 0, ...props }: any) => {
	let subtractHeightDef = 122

	return (
		<TableContainer style={{
			maxHeight: `calc(100vh - ${subtractHeightDef + subtractHeight}px)`,
			width: 'calc(100% - 3px)',
			marginLeft: '3px'
		}}>
			<Table stickyHeader style={{ borderCollapse: 'collapse' }}>
				{props.children}
			</Table>
		</TableContainer>
	)
}

// ** PAGINATOR START ** 
type PaginatorTypes = {
	length: number
	rowsPerPage: number
	currentPage: number
	handleChangePage: (event: unknown, newPage: number) => void
	handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const CustomPaginator: React.FC<PaginatorTypes> = ({ length, rowsPerPage, currentPage, handleChangePage, handleChangeRowsPerPage, ...props }) => {
	let classes = makeStyles(theme => ({
		paginator: {
			position: 'absolute',
			background: colors.bg_white_color,
			bottom: '0px',
			width: '100%',
			display: 'flex',
			flex: '1',
			alignItems: 'center',
			justifyContent: 'space-between',
			zIndex: 5,
			boxShadow: '0px 0px 4px rgba(50, 48, 51, 0.15)',
			"& .MuiTablePagination-caption": {
				display: 'none',
			},
			"& .MuiTablePagination-spacer": {
				display: 'none',
			},
			"& .MuiTablePagination-toolbar": {
				display: 'flex',
				flex: '1',
				justifyContent: 'space-between',
			}
		}
	}))();



	return (
		<TablePagination
			className={classes.paginator}
			rowsPerPageOptions={[10, 25, 50, 100, 150]}
			component="div"
			count={length}
			rowsPerPage={rowsPerPage}
			page={currentPage}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={handleChangeRowsPerPage}
			ActionsComponent={TablePaginationActions}
		>
		</TablePagination>
	)
}

type TablePaginationActionsProps = {
	count: number;
	page: number;
	rowsPerPage: number;
	onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions({ count, page, rowsPerPage, onChangePage, ...props }: TablePaginationActionsProps) {
	const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onChangePage(event, page - 1);
	};

	const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onChangePage(event, page + 1);
	};

	let classes = makeStyles(theme => ({
		root: {
			width: '100%',
			margin: '0 auto',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		paginator__pages: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		paginator__item: {
			border: `1px solid ${colors.main_gray_color}`,
			borderLeft: 'none',
			boxSizing: 'border-box',
			fontSize: '14px',
			padding: '7px 16.5px 7px 16.5px',

			"&:first-child": {
				borderLeft: `1px solid ${colors.main_gray_color}`,
			},

			"&.arrow": {
				margin: '0 20px',
				borderRadius: '4px',
				border: `1px solid ${colors.main_gray_color}`,
			}

		},
		paginator__item_active: {
			border: `2px solid ${colors.main_blue_color}`,
			padding: '6px 16.5px 6px 16.5px',


			"&:first-child": {
				borderLeft: `2px solid ${colors.main_blue_color}`,
			},
		}
	}))();


	const [currentPagesArray, setCurrentPagesArray] = useState([1, 2, 3, 4, 5])

	useEffect(() => {
		let pagesCount = Math.ceil(count / rowsPerPage)
		let pages = []
		for (let i = 0; i < pagesCount; i++) {
			pages.push(i);
		}

		let leftPortionPageNumber = 0;
		let rightPortionPageNumber = 0;

		for (let i = 0; i < pagesCount; i++) {
			if (page - i < 5 && page - i >= 0) {
				leftPortionPageNumber = i
				break
			}
		}

		rightPortionPageNumber = leftPortionPageNumber + 5
		if (rightPortionPageNumber > pagesCount) {
			rightPortionPageNumber = pagesCount - leftPortionPageNumber
		}
		pages = pages.filter(page => page >= leftPortionPageNumber && page < rightPortionPageNumber)

		setCurrentPagesArray(pages)
	}, [count, page, rowsPerPage])


	return (
		<div className={classes.root}>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
				className={cn(classes.paginator__item, "arrow")}
			> {"<"}
			</IconButton>

			<div className={classes.paginator__pages}>
				{currentPagesArray.map(pageEl =>
					<div
						className={cn(classes.paginator__item, { [classes.paginator__item_active]: pageEl === page })}
						onClick={(event: any) => { onChangePage(event, pageEl); }}
					>
						{pageEl + 1}</div>
				)}
			</div>

			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
				className={cn(classes.paginator__item, "arrow")}>{">"}
			</IconButton>

		</div>
	);
}
// ** PAGINATOR END ** 


type Order = 'asc' | 'desc';
type TableHeaderCellsProps = {
	labels: Array<LabelType | any>
	Component?: any
	onRequestSort?: (event: React.MouseEvent<unknown>, property: string) => void;
	order?: Order;
	orderBy?: string;
	noSorting?: boolean
}
export const CustomTableHeaderCells: React.FC<TableHeaderCellsProps> = ({ labels, Component, noSorting = false, ...props }) => {
	if (!Component)
		Component = StyledTableCell

	const { order, orderBy, onRequestSort = () => {} } = props;
	const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};



	return (
		<>
			{ labels.map((label, counter) => (
					<Component
						key={counter}
						align={(label.align === 'right') ? label.align : "left"}
						sortDirection={orderBy === label.name ? order : false}>

					
					{noSorting || label.name === "" || label.notSortable ?
						<div>{label.label}</div> :  
						<TableSortLabel
							active={orderBy === label.name}
							direction={orderBy === label.name ? order : 'asc'}
							onClick={createSortHandler(label.name)}
						>
							{label.label}
						</TableSortLabel>
						}

						

					</Component>
				)) }
		</>
	)
}