import Axios from 'axios';
import qs from 'querystring'
import * as ApiTypes from './types'
import { EldType } from '../types/elds';
import { PasswordObjectType } from '../types/types';

// https://cors-anywhere.herokuapp.com/
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
		return instance.post<ApiTypes.GetUserInfoResponseType>(`auth/login`, qs.stringify({ user_login: login, user_password: password }))
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
			.catch((err) => { return err })
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
	changePassword(passwordObj: PasswordObjectType) {
		
		return instance.patch(`user/change-password`, qs.stringify({ ...passwordObj }))
			.then((response) => {
				return response.data
			})
			.catch((err) => { return err });;
	},

	getUserInfo(userId: number) {
		return instance.get(`user/info/${userId}`)
			.then((response) => {
				return response.data
			})
			.catch((err) => { return err });
	}
}

export const eldsAPI = {
	getElds(company_id: number, page?: number, limit?: number) {
		return instance.get(`company/elds/${company_id}`)
			.then((response) => {
				return response.data
			})
			.catch((err) => { return err });
	},
	getEld(id: number) {
		return instance.get(`eld/get/${id}`)
			.then((response) => {
				return response.data
			})
			.catch((err) => { return err });
	},
	addEld(eldData: EldType) {
		return instance.post(`eld/add`, qs.stringify({ ...eldData }))
			.then(response => response.data)
			.catch((err) => { return err });
	},
	editEld(eldData: EldType) {
		return instance.patch(`eld/edit`, qs.stringify({ ...eldData }))
			.then(response => response.data)
			.catch((err) => { return err });
	},
	deleteEld(id: number) {
		return instance.delete(`eld/delete/${id}`)
			.then(response => response.data)
			.catch((err) => { return err });
	},
}


export const vehiclesAPI = {
	getVehicles(company_id: number) {
		return instance.get(`vehicle/list/${company_id}`)
			.then((response) => {
				return response.data
			})
			.catch((err) => { return err });
	},
	deleteVehicle(id: number) {
		return instance.delete(`vehicle/delete/${id}`)
			.then(response => response.data)
			.catch((err) => { return err });
	},
	
	activateVehicle(id: number) {
		return instance.post(`vehicle/activate/${id}`)
			.then(response => response.data)
			.catch((err) => { return err });
	}
}


export const appAPI = {

}