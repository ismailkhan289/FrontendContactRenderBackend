import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { UserContext } from '../coreComp/UserContext';

const Home = () => {
  const {user} = useContext(UserContext);
  const {authenticated} = useContext(UserContext);
  

 
 

 
  const message = user ?
    <h2>Welcome, {user.name}!</h2> :
    <p>Please log in to manage your JUG Tour.</p>;

  const button = authenticated ?
    <div>
      <Button color="link"><Link to="/groups">Manage JUG Tour</Link></Button>
      </div>
      :'';

  return (
    <div>
      {message}
      {button}
    </div>
  );
}

export default Home;