import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import NavBarApp from './NavBarApp';
import FooterApp from './FooterApp';

const MainContainer = ({children}) => {
  const {user, authenticated, logout, login} = useContext(UserContext);
 
    return (
       <>
       <Container fluid>
        <NavBarApp user={user} authenticated={authenticated} logout={logout} login={login} />
        {children}
        <FooterApp />
      </Container>
       </>
    );
    };
    export default MainContainer;