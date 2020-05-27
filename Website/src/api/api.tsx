import Axios from 'axios';
import qs from 'querystring'
import * as ApiTypes from './types'
import { EldType } from '../types/elds';
import { PasswordObjectType } from '../types/types';


const instance = Axios.create({
	baseURL: "https://cors-anywhere.herokuapp.com/http://api.eld.sixhands.co/",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
});

export const setTokenForAPI = (token: string) => {
	instance.defaults.headers.token = token;
}



export const userAPI = {
	login(login: string, password: string) {
		return instance.post(`auth/login`, {user_login: login, user_password: password})
			.then((response) => {
				return response.data
			})
			.catch((err) => { console.log(err) })

	},
	logout() {
		return instance.post(`auth/logout`)
			.then((response) => {
				return response.data
			})
			.catch((err) => { console.log(err) })
	},

	// register(username: string, email: string, password: string) {
	// 	return instance.post(`register`, { username, email, password })
	// 		.then((response) => {
	// 			return response.data
	// 		}
	// 		);
	// },
	// changeEmail(email: string) {
		// console.log('Changing email: ' + email)
		// return instance.post(`change-email`, { email })
		// 	.then((response) => {
		// 		return response.data
		// 	}
		// );
	// },
	// resetPassword(email: string) {
		// return instance.post(`reset-pass`, { email })
		// 	.then((response) => {
		// 		return response.data
		// 	}
		// );
	// },
	// changePassword(password: string) {
	// 	return instance.post(`/users/update/password`, { password })
	// 		.then((response) => {
	// 			return response.data
	// 		}
	// 	);
	// },

	// getUserInfo() {
	// 	return instance.get(`users/profile`)
	// 		.then((response) => {
	// 			return response.data
	// 		});
	// }
}





export const appAPI = {
	
}