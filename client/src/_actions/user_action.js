import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER
} from './types';

// login action
export function loginUser(dataToSubmit) {
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data);

    // component에서 받은 데이터를 reducer에 전달
    // /_reducers/user_reducer.js에 전달
    // type, response를 전달
    return {
        type: LOGIN_USER,
        payload: request
    };
}

// register action
export function registerUser(dataToSubmit) {
    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data);

    // component에서 받은 데이터를 reducer에 전달
    // /_reducers/user_reducer.js에 전달
    // type, response를 전달
    return {
        type: REGISTER_USER,
        payload: request
    };
}

