import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    };
    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    };
    const onSubmitHandler = (e) => {
        e.preventDefault();

        let body = {
            email: Email,
            password: Password
        };

        // action에 dispatch되어 reducer로 가, 데이터 처리하기
        // /_action/user_action.js으로 dispatch
        dispatch(loginUser(body))
        .then(response => {
            // login이 성공적으로 일어났을 경우 랜딩페이지로 이동
            if(response.payload.loginSuccess) {
                props.history.push('/');
            }else {
                alert('Error...');
            }
        });
    };

    return (
        <div
            style={{
                display:'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100vh'
            }}
        >
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input
                    type="email"
                    value={Email}
                    onChange={onEmailHandler}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={Password}
                    onChange={onPasswordHandler}
                />
                <br />
                <button>Login</button>
            </form>
        </div>
    )
}

export default LoginPage
