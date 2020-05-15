import { makeStyles } from '@material-ui/core'
import { colors } from '../../../assets/scss/Colors/Colors'


export const useTableStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		height: '100%'
	},	

	paginator: {
		position: 'absolute',
		background: colors.bg_white_color,
		bottom: '0px',
		width: '100%',
		zIndex: 5,
		boxShadow: '0px 0px 4px rgba(50, 48, 51, 0.15)',
	}
}))


export const useToolbarStyles = makeStyles(theme => ({
	toolBar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',

		"& .delete-selected": {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
	},
	toolBar_active: {
		color: colors.placholder_text_color
	},
}))