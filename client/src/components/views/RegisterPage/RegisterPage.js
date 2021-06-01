import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    };
    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    };
    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    };
    const onConfirmPasswordHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    };
    const onSubmitHandler = (e) => {
        e.preventDefault();

        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
        }

        let body = {
            email: Email,
            password: Password,
            name: Name
        };

        // action에 dispatch되어 reducer로 가, 데이터 처리하기
        // /_action/user_action.js으로 dispatch
        dispatch(registerUser(body))
        .then(response => {
            // register이 성공적으로 일어났을 경우 랜딩페이지로 이동
            if(response.payload.success) {
                props.history.push('/login');
            }else {
                alert('Failed to Sign Up...');
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
                
                <label>Name</label>
                <input
                    type="text"
                    value={Name}
                    onChange={onNameHandler}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={Password}
                    onChange={onPasswordHandler}
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={ConfirmPassword}
                    onChange={onConfirmPasswordHandler}
                />

                <br />
                <button>Register</button>
            </form>
        </div>
    )
}

export default RegisterPage