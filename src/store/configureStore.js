import {
  combineReducers
} from 'redux'

import rspo from './reducers/rspo'
import AuthenticationReducer from './reducers/authentication';
import ConsortiumListReducer from './reducers/consortiumlist';



//Merge reducers
const rootReducer = combineReducers({
  rspoReducer: rspo,
  authenticationReducer: AuthenticationReducer,
  consortiumListReducer: ConsortiumListReducer
});


export default rootReducer;

