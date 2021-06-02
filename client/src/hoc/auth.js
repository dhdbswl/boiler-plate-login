import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {
        // back-end에 request를 보내 상태 가져오기
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth())
            .then(response => {
                // 유저 통제 분기 처리

                if(!response.payload.isAuth) {
                    // 로그인 하지 않은 상태
                    if(option) {
                        // true : 로그인 한 유저만 출입 가능한 페이지이므로 login 페이지로 이동
                        props.history.push('/login')
                    }
                } else {
                    // 로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        // 어드민이 아닌데 어드민 페이지로 접근하려는 경우 landing 페이지로 이동
                        props.history.push('/')
                    } else {
                        if(option === false) {
                            // false : 로그인 한 유저는 출입 불가능한 페이지
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}

/*
들어갈 수 있는 페이지들에 대한 통제를 위한 js

1. hoc의 auth 컴포넌트에서 Back-end에 request를 보낸다.
2. 현재 접근하려는 user의 상태를 hoc의 auth 컴포넌트로 가져온다.
3. 상태는 로그인이 되어있는/되어있지 않은 유저인지, 어디민 유저인지 등을 확인하는 상태
4. hoc의 auth에서 상태를 확인 후 접근하지 못하는 유저는 접근을 하지 못하도록 다른 페이지로 보낸다.

ex1) 일반 유저가 어드민 페이지로 접근하려는 경우 다른 페이지로 보내, 접근하지 못하도록 한다.
ex2) 로그인 한 유저가 로그인페이지로 이동하려고 하는 경우 이미 로그인을 한 상태이니 다른 페이지로 보낸다.

---
1. 아무나 접근 가능한 페이지 ex) Landing Page, About Page
2. 로그인한 회원만 진입 가능한 페이지 ex) Detail Page
3. 로그인한 회원은 진입 못하는 페이지 ex) Register Page, Login Page
4. 관리자만 진입 가능한 페이지 ex) Admin Page

---
function (SpecificComponent, option, adminRoute = null)
1. SpecificComponent : 컴포넌트
2. option
- null : 아무나 출입이 가능한 페이지
- true : 로그인 한 유저만 출입 가능한 페이지
- false : 로그인 한 유저는 출입 불가능한 페이지
3. adminRoute
- null
- true : 어드민 유저만 들어갈 수 있는 페이지

---
컴포넌트 넣어주기
App.js

import Auth from './hoc/auth';
<Route exact path="/login" component={Auth(LoginPage)} />


*/