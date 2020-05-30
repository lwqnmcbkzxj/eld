import React, { FC, useState } from 'react'
import { Paper, TableHead, TableRow, TableBody, withStyles, Toolbar, Button } from '@material-ui/core';
import StatusLabel from '../Common/StatusLabel/StatusLabel'
import { StyledTableCell, CustomTable, CustomPaginator, CustomTableHeaderCells } from '../Common/StyledTableComponents/StyledTableComponents'

import { StyledSearchInput } from '../Common/StyledTableComponents/StyledInputs'
import { StyledDefaultButtonSmall } from '../Common/StyledTableComponents/StyledButtons'

import { CompanyType } from '../../types/companies'
import { isContainsSearchText } from '../../utils/isContainsSearchText'

import CompanyModal from '../Common/Modals/PagesModals/CompanyModal'

import historyIcon from '../../assets/img/ic_history.svg'
import editIcon from '../../assets/img/ic_edit.svg'
import { PasswordObjectType } from '../../types/types';

type PropsType = {
	rows: Array<CompanyType>
	changePassword: (passwordObj: PasswordObjectType) => void
	handleAdd: (company: CompanyType) => void
	handleEdit: (company: CompanyType) => void
	handleToggleActive: (companyId: number) => void
}
type Order = 'asc' | 'desc';

const CompaniesTable: FC<PropsType> = ({ rows, handleAdd, handleEdit, changePassword, handleToggleActive, ...props }) => {
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
		{ label: "No.", name: '' },
		{ label: "Company name", name: '' },
		{ label: "Contact Name", name: '' },
		{ label: "Contact Phone", name: '' },
		{ label: "Active units", name: '' },
		{ label: "Subscribe Type", name: '' },
		{ label: "Current Balance", align: 'right', name: '' },
		{ label: "Status", name: '' },
		{ label: "Actions", name: '' },
	]
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState(labels[0].name);

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};


	let currentModalDataObj = {
		company_name: '',
		company_address: '',
		subscribe_type: '',
		company_timezone: '',
		contact_name: '',
		contact_phone: '',
		email: '',
		usdot: '',

		terminal_adresses: ['']
	}

	const [currentModalData, setCurrentModalData] = useState({});

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
					{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
						isContainsSearchText(searchText, row, ['number', 'company_name', 'contact_name', 'contact_phone', 'active_units', 'subscribe_type', 'current_balance']) &&

						<TableRow
							key={row.id}
							hover
							onMouseEnter={() => { setHoverId(row.id) }}
							onMouseLeave={() => { setHoverId(-1) }}
							onDoubleClick={() => {
								setEditModalOpen(true);
								setCurrentModalData(row)
							}}

						>

							<StyledTableCell>{row.number}</StyledTableCell>
							<StyledTableCell>{row.company_name}</StyledTableCell>
							<StyledTableCell>{row.contact_name}</StyledTableCell>
							<StyledTableCell>{row.contact_phone}</StyledTableCell>
							<StyledTableCell>{row.active_units}</StyledTableCell>
							<StyledTableCell>{row.subscribe_type}</StyledTableCell>
							<StyledTableCell align={'right'}>{row.current_balance}</StyledTableCell>

							<StyledTableCell><StatusLabel text={row.status}/></StyledTableCell>
							<StyledTableCell style={{ minWidth: '100px', boxSizing: 'border-box', paddingTop: '10px', paddingBottom: '10px' }}>
								{hoverId === row.id &&
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
										<button style={{ height: '32px' }}><img src={historyIcon} alt="hisotry-icon" /></button>
										<button style={{ height: '32px' }}
											onClick={() => {
												setEditModalOpen(true);
												setCurrentModalData(row)
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
					handleToggleActive={handleToggleActive}
					changePassword={changePassword}
					initialValues={currentModalData}
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
