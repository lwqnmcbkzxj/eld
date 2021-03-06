import React, { FC, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { Paper, TableHead, TableRow, TableBody, Toolbar } from '@material-ui/core';
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'
import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { PasswordObjectType, AppStateType, StatusEnum } from '../../types/types';
import { CompanyType } from '../../types/companies'

import StatusLabel from '../Common/StatusLabel/StatusLabel'
import CompanyModal from '../Common/Modals/PagesModals/CompanyModal'
import Loader from '../Common/Loader/Loader';

import historyIcon from '../../assets/img/ic_history.svg'
import editIcon from '../../assets/img/ic_edit.svg'

import { isContainsSearchText } from '../../utils/isContainsSearchText'
import { isFetchingArrContains } from '../../utils/isFetchingArrayContains';

import { getCompanyFromServer } from '../../redux/companies-reducer'
import { getComparator, stableSort } from '../../utils/tableFilters'

type PropsType = {
	rows: Array<CompanyType>
	changePassword: (companyId: number, passwordObj: PasswordObjectType) => void
	handleAdd: (company: CompanyType) => void
	handleEdit: (company: CompanyType) => void
}
type Order = 'asc' | 'desc';

const CompaniesTable: FC<PropsType> = ({ rows, handleAdd, handleEdit, changePassword, ...props }) => {
	const dispatch = useDispatch()
	const isFetchingArray = useSelector<AppStateType, Array<string>>(state => state.app.isFetchingArray)
	const company = useSelector<AppStateType, CompanyType>(state => state.companies.currentCompany)


	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const [searchText, setSearchText] = React.useState("")

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	};

	let labels = [
		{ label: "No.", name: 'company_id' },
		{ label: "Company name", name: 'company_short_name' },
		{ label: "Contact Name", name: 'company_contact_name' },
		{ label: "Contact Phone", name: 'company_contact_phone' },
		{ label: "Active units", name: '' },
		{ label: "Subscribe Type", name: 'company_subscribe_type' },
		{ label: "Current Balance", align: 'right', name: 'company_usdot' },
		{ label: "Status", name: 'company_status' },
		{ label: "Actions", name: '' },
	]
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};


	const [addModalOpen, setAddModalOpen] = useState(false)
	const handleAddModalClose = () => {
		setAddModalOpen(false);
	};
	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};

	const [hoverId, setHoverId] = useState(-1)
	return (
		<Paper style={{ boxShadow: 'none' }}>
			<Toolbar style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
				<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />
				<StyledDefaultButtonSmall variant="outlined" onClick={() => { setAddModalOpen(true) }}>Add company</StyledDefaultButtonSmall>
			</Toolbar>

			<CustomTable subtractHeight={52}>
				<TableHead>
					<TableRow>
						<CustomTableHeaderCells
							labels={labels}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
					</TableRow>
				</TableHead>


				<TableBody>
					{!isFetchingArrContains(isFetchingArray, ['companies']) &&
						stableSort(rows as any, getComparator(order, orderBy))						
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row: any, counter) => (
							isContainsSearchText(searchText, row, [
								'counter',
								'company_short_name',
								'company_contact_name',
								'company_contact_phone',
								'company_sort',
								'company_subscribe_type',
								'company_usdot',
								'company_status',
							]) &&

							<TableRow
								key={row.company_id}
								hover
								onMouseEnter={() => { setHoverId(row.company_id) }}
								onMouseLeave={() => { setHoverId(-1) }}
								onDoubleClick={() => {
									setEditModalOpen(true);
									dispatch(getCompanyFromServer(row.company_id))
								}}

							>
								<StyledTableCell>{row.company_id}</StyledTableCell>
								<StyledTableCell>{row.company_short_name}</StyledTableCell>
								<StyledTableCell>{row.company_contact_name}</StyledTableCell>
								<StyledTableCell>{row.company_contact_phone}</StyledTableCell>
								<StyledTableCell>{row.company_sort}</StyledTableCell>
								<StyledTableCell>{row.company_subscribe_type}</StyledTableCell>
								<StyledTableCell align={'right'}>{row.company_usdot}</StyledTableCell>

								<StyledTableCell><StatusLabel text={row.company_status} /></StyledTableCell>
								<StyledTableCell style={{ minWidth: '100px', boxSizing: 'border-box', paddingTop: '10px', paddingBottom: '10px' }}>
									{hoverId === row.company_id &&
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<button style={{ height: '32px' }}><img src={historyIcon} alt="hisotry-icon" /></button>
											<button style={{ height: '32px' }}
												onClick={() => {
													setEditModalOpen(true);
													dispatch(getCompanyFromServer(row.company_id))
												}} >
												<img src={editIcon} alt="hisotry-icon" />
											</button>
										</div>
									}
								</StyledTableCell>
							</TableRow>
						))}
				</TableBody>
			</CustomTable>

			{isFetchingArrContains(isFetchingArray, ['companies']) && <Loader />}

			<CustomPaginator
				length={rows.length}
				rowsPerPage={rowsPerPage}
				currentPage={page}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>


			{/* Edit modal */}
			{editModalOpen &&
				<CompanyModal
					open={editModalOpen}
					handleClose={handleEditModalClose}
					submitFunction={handleEdit}
				
					changePassword={changePassword}
					initialValues={company}
					titleText={"Edit Company"}
				/>}

			{/* Add modal */}
			{addModalOpen &&
				<CompanyModal
					open={addModalOpen}
					handleClose={handleAddModalClose}
					submitFunction={handleAdd}
					initialValues={{}}
					titleText={"Add Company"}
				/>}
		</Paper>
	)
}

export default CompaniesTable;
