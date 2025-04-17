import React from 'react';

import NavBarApp from './coreComp/NavBarApp';
const HomeLoggedIn = ({ authenticating }) => {
    console.log(authenticating);
    return (
        <div>
            <NavBarApp />
            <h1>Welcome Back, {authenticating}!</h1>
            <p>You are logged in.</p>
        </div>
    );
};

export default HomeLoggedIn;