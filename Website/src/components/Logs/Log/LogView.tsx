import React, { FC, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { AppStateType } from '../../../types/types'
import { UserType } from '../../../types/user'

import PreviewPage from './LogPreview'

import SimpleTable from '../../Common/SimpleTable/SimpleTable'
import GoogleMap from '../../Common/GoogleMap/GoogleMap'
import { LabelType } from '../../../types/types'
import InfoBlock from './LogInfoBlock'
import LogsModal from '../../Common/Modals/PagesModals/LogsModal'

let logsValues = [
	{
		number: '6',
		status: 'on duty',
		time: '12:00:00 AM',
		duration: '01:34',
		location: '2.6 mi N of Woodburn, OR',
		odometer: "13406.0",
		eng_hours: "3643.0",
		note: "asdasd"
	},
	{
		number: '5',
		status: 'sleeper',
		time: '112:00:00 AM',
		duration: '021:34',
		location: '2.6 mi N of Woodburn, OR',
		odometer: "sad13406.0",
		eng_hours: "23643.0",
		note: "2asdasd"
	},
	{
		number: '5',
		status: 'driving',
		time: '112:00:00 AM',
		duration: '021:34',
		location: '2.6 mi N of Woodburn, OR',
		odometer: "sad13406.0",
		eng_hours: "23643.0",
		note: "2asdasd"
	},
]

let dvirValues = [
	{
		date: '03.12.20  11:30 AM',
		vehicle: '024',
		status: 'no defects found',
		driver_signature: false,
		mechanic_signature: true,
		note: 'iasydgasijndqwigdjsab78gf',
	},
	{
		date: '03.12.20  11:30 AM',
		vehicle: '024',
		status: 'no defects found',
		driver_signature: false,
		mechanic_signature: true,
		note: 'iasydgasijndqwigdjsab78gf',
	},
]


type PropsType = {
	// driver: DriverType
}

const ViewPage: FC<PropsType> = ({ ...props }) => {
	let logsLabels = [
		{ label: "No.", name: 'number' },
		{ label: "Status", name: 'status' },
		{ label: "Time (CST)", name: 'time' },
		{ label: "Duration", name: 'duration' },
		{ label: "Location", name: 'location' },
		{ label: "Odometer", name: 'odometer' },
		{ label: "Eng. Hours", name: 'eng_hours' },
		{ label: "Notes", name: 'note' },

	] as Array<LabelType>

	let dvirLabels = [
		{ label: "Date & Time (CST)", name: 'date' },
		{ label: "Vehicle", name: 'vehicle' },
		{ label: "Status", name: 'status' },
		{ label: "Driver’s Signature", name: 'driver_signature' },
		{ label: "Mechanic’s Signature", name: 'mechanic_signature' },
		{ label: "Description", name: 'note' },

	] as Array<LabelType>


	let loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)

	const [currentModalData, setModalData] = useState({})
	const [editModalOpen, setEditModalOpen] = useState(false)
	const handleEditModalClose = () => {
		setEditModalOpen(false);
	};




	return (
		<div className={"page log-page"}>
			<PreviewPage
				loggedUserId={loggedUser.role_id}
				setModalData={setModalData}
				setEditModalOpen={setEditModalOpen}
			/>

			<SimpleTable
				rows={logsValues}
				labels={logsLabels}
			/>
			<InfoBlock />

			<SimpleTable
				tableTitle="Dvir"
				rows={dvirValues}
				labels={dvirLabels}
			/>

				{/* Edit modal */}
				{editModalOpen &&
				<LogsModal
					open={editModalOpen}
					handleClose={handleEditModalClose}
					initialValues={currentModalData}
					titleText={"Edit Event"}
					submitFunction={() => { console.log('s') }}
				/>}
		</div>
	)
}

export default ViewPage;
