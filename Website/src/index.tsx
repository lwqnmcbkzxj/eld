import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './redux/redux-store'

import { createMuiTheme, Theme as AugmentedTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			dark: '#1552BC',
			main: '#1A66E5',
			light: '#3D81F2',
		},
		secondary: {
			dark: '#C22108',
			main: '#E53C22'
		},
		text: {
			primary: '#323033',
			secondary: '#79757D',
		},
		background: {
			default: '#F8F7F8',			
		},
		success: {
			main: '#80B302'
		},
		warning: {
			main: '#E09D10'
		},
	},
	typography: {
		fontFamily: 'Heebo',
	}
});

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
			<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.unregister();
