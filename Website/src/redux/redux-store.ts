import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import appReducer from "./app-reducer"
import userReducer from "./user-reducer"

import unitsReducer from "./units-reducer"
import driversReducer from "./drivers-reducer"
import vehiclesReducer from "./vehicles-reducer"
import eldsReducer from "./elds-reducer"
import logsReducer from "./logs-reducer"

import companiesReducer from "./companies-reducer"



import { reducer as formReducer } from "redux-form";


let rootReducer = combineReducers({    
	
	// common
	app: appReducer,
	user: userReducer,

	// user
	units: unitsReducer,
	drivers: driversReducer,
	vehicles: vehiclesReducer,
	elds: eldsReducer,
	logs: logsReducer,

	// admin
	companies: companiesReducer,


    form: formReducer
}); 


export type RootReducerType = typeof rootReducer

const store = createStore(rootReducer,composeWithDevTools (applyMiddleware(thunkMiddleware)));
export default store;