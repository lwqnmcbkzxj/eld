import { makeStyles } from "@material-ui/core/styles";
import { colors } from '../../assets/scss/Colors/Colors.js'


const useStyles = makeStyles(theme => ({
	menuList: {
		height: 'calc(100vh - 58px)',
		boxSizing: 'border-box',
		background: colors.bg_white_color,
		padding: '16px 8px',
		width: '232px',
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		position: 'relative',
	},
	
	list__item: {
		width: '100%',
		borderRadius: '4px',
		backgroundColor: '#FFFFFF',
		color: colors.secondary_text_color,
		"& p": {
			fontSize: '12px',
			lineHeight: '18px',
			textTransform: 'uppercase',
			letterSpacing: '0.5px',
			fontFamily: 'Heebo Medium',
			marginLeft: '15px'
		},
		"& .svgIcon": {
			filter: 'none'
		},
		"&:hover": {
			backgroundColor: colors.bg_component_color
		},
	},
	
	list__item_active: {
		color: colors.primary_text_color,
		fontFamily: 'Heebo Bold',
		backgroundColor: colors.bg_component_color,
		"& > .svgIcon": {
			filter: 'invert(35%) sepia(65%) saturate(4721%) hue-rotate(210deg) brightness(92%) contrast(95%)',
		}
	},
	menu__footer: {
		color: colors.placholder_text_color,
		fontSize: '12px',
		lineHeight: '18px',
	},
	
}));

export default useStyles;