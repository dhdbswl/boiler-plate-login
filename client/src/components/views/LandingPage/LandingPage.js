import React, { useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(response => {console.log(response)});
    }, []);

    const onLogOutHandler = () => {
        axios.get(`/api/users/logout`)
        .then(response => {
            if(response.data.success){
                props.history.push("/login")
            } else{
                alert('Faild to logout')
            }
        })
    }

    return (
        <div>
            <h1>LandingPage</h1>
            <button
                onClick={onLogOutHandler}
            >LogOut</button>
        </div>
    )
}

export default withRouter(LandingPage)