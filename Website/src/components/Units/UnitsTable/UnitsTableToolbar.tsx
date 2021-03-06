import React, { FC } from 'react'
import cn from 'classnames'
import { Toolbar, IconButton, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import refreshIcon from '../../../assets/img/ic_refresh.svg'

import toggleArrowBottom from '../../../assets/img/ic_arrow_bottom.svg'
import toggleArrowUp from '../../../assets/img/ic_arrow_up.svg'


import { StyledSearchInput } from '../../Common/StyledTableComponents/StyledInputs'

import { useToolbarStyles  } from './UntisTableStyle.js'
import { EnhancedTableToolbarProps } from './UnitsTableTypes'




const EnhancedTableToolbar: FC<EnhancedTableToolbarProps> = ({ numSelected, selected, deleteItem, searchText, setSearchText, getUnits, toggleTable, tableVisible, ...props }) => {
	const classes = useToolbarStyles()
	const deleteItems = (selectedIds: string[]) => {
		selectedIds.map(id => deleteItem(+id))
	}

	return (
		<Toolbar className={cn(classes.toolBar, { [classes.toolBar_active]: numSelected > 0 })}>

			<StyledSearchInput searchText={searchText} setSearchText={setSearchText} />			

			<div className="service-icons">
				<IconButton onClick={getUnits}><img src={refreshIcon} alt="referesh-icon" /></IconButton>
				<IconButton>
					<img src={ tableVisible ? toggleArrowUp : toggleArrowBottom } alt="arrow-icon" onClick={toggleTable} />
				</IconButton>
			</div>
		</Toolbar>
	);
};




export default EnhancedTableToolbar