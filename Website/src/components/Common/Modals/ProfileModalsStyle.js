import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
	createStyles({
		form: {
			display: 'flex',
			flexDirection: 'column',
			margin: 'auto',
			width: 'fit-content',
		},
		formControl: {
			marginTop: theme.spacing(2),
			minWidth: 120,
		},
		formControlLabel: {
			marginTop: theme.spacing(1),
		},
	}),
);