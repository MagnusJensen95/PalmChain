import {
  combineReducers
} from 'redux'

import rspo from './reducers/rspo'



//Merge reducers
const rootReducer = combineReducers({
  rspoReducer: rspo

});


export default rootReducer;

