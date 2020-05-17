import { makeStyles, createStyles } from "@material-ui/core/styles";
import { colors } from '../../../assets/scss/Colors/Colors';


export const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			"& .MuiDialog-paperWidthMd": {
				maxWidth: '996px'
			},
			"& .MuiDialog-paperWidthSm": {
				maxWidth: '500px'
			},
			"& .MuiDialog-paperWidthXs": {
				maxWidth: '344px'
			},
		},
		dialog__header: {
			padding: '16px 32px',
			"& h2": {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',

				color: colors.placholder_text_color,
				letterSpacing: '1px',
				textTransform: 'uppercase',
				fontSize: '20px',
				lineHeight: '29px',
				fontFamily: 'Heebo Bold',
				"& span": {
					color: colors.primary_text_color
				}
			}
		},
		dialog__content: {
			padding: '8px 32px',
			
		},
		
		dialog__actions: {
			borderTop: `1px solid ${colors.light_line_color}`,
			justifyContent: 'space-between',
			padding: '16px 32px',
			display: 'grid',
			gridGap: '24px',
			gridTemplateColumns: '1fr 1fr',
			
			display: 'flex',
			justifyContent: 'flex-end',
			"& button:first-child": {
				marginRight: '24px',
			},
		}

	}),
);