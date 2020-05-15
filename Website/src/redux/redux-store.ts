import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"

import appReducer from "./app-reducer"


import { reducer as formReducer } from "redux-form";



let rootReducer = combineReducers({    
	
	app: appReducer,

    form: formReducer
}); 


export type RootReducerType = typeof rootReducer

const store = createStore(rootReducer,composeWithDevTools (applyMiddleware(thunkMiddleware)));
export default store;