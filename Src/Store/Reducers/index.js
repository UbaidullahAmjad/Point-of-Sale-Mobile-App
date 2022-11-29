import { combineReducers } from 'redux';
import CartReducer from './CartReducer';
import PRoductReducer from './PRoductReducer';
import SharedReducer from './SharedReducer';

export default combineReducers({
   Product: PRoductReducer,
   Cart: CartReducer,
   shared: SharedReducer
});
