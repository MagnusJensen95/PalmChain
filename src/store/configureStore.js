import {
  combineReducers
} from 'redux'

import rspo from './reducers/rspo'
import AuthenticationReducer from './reducers/authentication';
import ConsortiumListReducer from './reducers/consortiumlist';
import PlantationReducer from './reducers/plantation';



//Merge reducers
const rootReducer = combineReducers({
  rspoReducer: rspo,
  authenticationReducer: AuthenticationReducer,
  consortiumListReducer: ConsortiumListReducer,
  plantationReducer: PlantationReducer
});


export default rootReducer;

