import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import {  Container } from 'reactstrap';
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