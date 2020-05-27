import React from 'react';
import Logo from '../Common/Logo/Logo';
import { Paper, makeStyles } from '@material-ui/core'
import { Formik, Form } from 'formik';
import * as yup from "yup";

import { CustomField } from '../Common/FormComponents/FormComponents'
import { StyledConfirmButton } from '../Common/StyledTableComponents/StyledButtons'
import { StyledFilledInput } from '../Common/StyledTableComponents/StyledInputs'
import { login } from '../../redux/user-reducer'
import { useDispatch } from 'react-redux'
import { colors } from '../../assets/scss/Colors/Colors'
import bgLine from '../../assets/img/login-form-line.png'

import { Redirect } from 'react-router-dom'

const Login = () => {
	const dispatch = useDispatch()
	const classes = makeStyles(theme => ({
		login_form: {
			position: 'absolute',
			padding: '32px 30px 25px 30px',
			maxWidth: '25vw',
			maxHeight: '44vh',
			marginTop: '28vh',
			left: 'calc(50vw - 182px)',
			minHeight: '393px',
			minWidth: '364px',
			boxSizing: 'border-box',
			margin: '0 auto',
			background: '#fff',
			zIndex: 5,

		},
		login_form__inputs: {
			margin: '50px 0 30px 0',
		},
		login_form__bg: {
			zIndex: 4,
			position: 'absolute',
			maxWidth: '25vw',
			maxHeight: '44vh',
			left: 'calc(50vw - 182px)',
			minHeight: '393px',
			minWidth: '364px',
			display: 'flex',
			"& .bg_line": {
				position: 'absolute',
				height: '100vh',

				"&:nth-child(2)": {
					marginLeft: '54px'
				},

				"&:nth-child(3)": {
					marginLeft: '108px'

				},
				"&:nth-child(4)": {
					marginLeft: '162px'

				},
				"&:nth-child(5)": {
					marginLeft: '216px'

				},
			}
		}
	}))()

	const handleLogin = async (data: any, setSubmitting: any) => {
		setSubmitting(true);
		await dispatch(login(data.login, data.password))
		setSubmitting(false);
	}
	const validationSchema = yup.object({
		// email: yup.string().required().email("Email must be valid"),
		login: yup.string().required(),
		password: yup.string().required().min(8).max(24),

	});


	return (
		<div className="page login_form-page">
			<div className={classes.login_form}>
				<Formik
					validateOnChange={true}
					initialValues={{ login: 'sidorov', password: 'Sidorov123' }}
					validationSchema={validationSchema}
					validate={values => {
						const errors: Record<string, string> = {};
						return errors;
					}}
					onSubmit={(data, { setSubmitting }) => {
						handleLogin(data, setSubmitting)
					}}
				>

					{({ values, errors, isSubmitting }) => (
						<Form>
							<div style={{ textAlign: 'center' }}><Logo height={64} /></div>

							<div className={classes.login_form__inputs}>
								<CustomField name={'login'} placeholder={'Login'} Component={StyledFilledInput} />
								<CustomField name={'password'} placeholder={'Password'} canSeeInputValue={true} Component={StyledFilledInput} />
							</div>
							<StyledConfirmButton style={{ width: '100%' }} type="submit">Log in</StyledConfirmButton>
						</Form>
					)}
				</Formik>
				
			</div>
			<div className={classes.login_form__bg}>
				<img src={bgLine} alt="bg-line" className={"bg_line"}/>
				<img src={bgLine} alt="bg-line" className={"bg_line"}/>
				<img src={bgLine} alt="bg-line" className={"bg_line"}/>
				<img src={bgLine} alt="bg-line" className={"bg_line"}/>
				<img src={bgLine} alt="bg-line" className={"bg_line"}/>
				</div>

		</div>
	);
}
export default Login; 