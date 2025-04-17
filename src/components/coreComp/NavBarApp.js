import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Button } from 'reactstrap';

const NavBarApp = ({ user, authenticated, logout, login }) => {
    const [isOpen, setIsOpen] = useState(false);

    // if (authenticated === undefined || authenticated === false) {
    //     return (
    //         <p>Loading...</p>
    //     );
    // }

    return (
        <>
        <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
            <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
            <Collapse isOpen={isOpen} navbar>
                {authenticated ?
                    <Nav className="justify-content-end" style={{ width: "100%" }} navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/contacts">My Contacts {user.name}</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="https://www.linkedin.com/in/ismail-khan-289per/">LinkedIn</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="https://github.com/ismailkhan289">GitHub</NavLink>
                        </NavItem>
                        <NavItem>
                            <Button onClick={logout}>Logout</Button>
                        </NavItem>
                    </Nav>
                    :<Nav className='justify-content-end' style={{ width: '100%' }} navbar>
                        <NavItem>
                            <Button onClick={login}>Login</Button>
                        </NavItem>
                    </Nav>};
            </Collapse>
        </Navbar>
        </>
    );
};

export default NavBarApp;
