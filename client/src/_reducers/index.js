import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
});

export default rootReducer;

/*
combineReducers
- 여러 개의 Reducer를 Root Reducer에서 하나로 합치도록 도와준다.
*/