import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from '../../types/types'

import TripsTable from './Trips'
import { VehicleType } from '../../types/vehicles';
import { getVehiclesFromServer } from '../../redux/vehicles-reducer';
import { UserType } from '../../types/user';


const TripsContainer: FC = ({ ...props }) => {
	const dispatch = useDispatch()
	const loggedUser = useSelector<AppStateType, UserType>(state => state.user.userInfo)


	let trips = [
		{
			start_time: 'Mar 13, 11:04 PM',
			driver_name: 'Bruce Wayne',
			truck_number: '032',
			status: 'Status',
			origin: '75.9 mi N of Ephrata, WA',
			distance: '40.6 mi',
			duration: '0:47',
			note: 'Text',
			trip: true,
		},
		{
			start_time: '1Mar 13, 11:04 PM',
			driver_name: '1Bruce Wayne',
			truck_number: '1032',
			status: 'Status',
			origin: '175.9 mi N of Ephrata, WA',
			distance: '140.6 mi',
			duration: '10:47',
			note: '1Text',
			trip: false,
		}
	]

	let tripsLabels = [
		{ label: 'Start time', name: 'start_time'  },
		{ label: 'Driver', name: 'driver_name'  },
		{ label: 'Truck No.', name: 'truck_number'  },
		{ label: 'Status', name: 'status', isSortable: false },
		{ label: 'Origin', name: 'origin'  },
		{ label: 'Distance', name: 'distance'  },
		{ label: 'Duration', name: 'duration'  },
		{ label: 'Note', name: 'note'  },
		{ label: 'Trip', name: 'trip', isSortable: false  },
	]

	return (
		<div className="page trips-page">
			<TripsTable
				rows={trips}
				labels={tripsLabels}
			/>
		</div>
	)
}

export default TripsContainer;