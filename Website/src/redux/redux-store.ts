import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import appReducer from "./app-reducer"
import unitsReducer from "./units-reducer"
import driversReducer from "./drivers-reducer"
import vehiclesReducer from "./vehicles-reducer"


import { reducer as formReducer } from "redux-form";



let rootReducer = combineReducers({    
	
	app: appReducer,
	units: unitsReducer,
	drivers: driversReducer,
	vehicles: vehiclesReducer,

    form: formReducer
}); 


export type RootReducerType = typeof rootReducer

const store = createStore(rootReducer,composeWithDevTools (applyMiddleware(thunkMiddleware)));
export default store;