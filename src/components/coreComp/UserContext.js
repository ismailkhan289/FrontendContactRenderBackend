import React, { createContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(undefined);
    const [cookies] = useCookies(['XSRF-TOKEN']);
  
      useEffect(() => {
          // setLoading(true);
          const fetchUser = async () => {
            try {
            const response = await fetch('api/user', { credentials: 'include' });
            const body = await response.text();
            if (body === '') {
              setAuthenticated(false);
            } else {
              setUser(JSON.parse(body));
              setAuthenticated(true);
            }
            } catch (error) {
            console.error("Error fetching user:", error);
            } finally {
            setLoading(false);
            }
          };
      
          fetchUser();
        }, [setAuthenticated, setLoading, setUser])
  
      const login = () => {
          let port = (window.location.port ? ':' + window.location.port : '');
          if (port === ':3000') {
            port = ':8080';
          }
          // redirect to a protected URL to trigger authentication
          window.location.href = `//${window.location.hostname}${port}/api/private`;
          }; 
      const logout = async () => {
          try {
              const res = await fetch('api/logout', {
                  method: 'POST', credentials: 'include',
                  headers: { 'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] }
              });
      
              if (!res.ok) {
                  throw new Error("Logout failed");
              }
      
              const response = await res.json();
      
              if (!response.logoutUrl || !response.idToken) {
                  throw new Error("Invalid logout response");
              }
      
              window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
                  + `&post_logout_redirect_uri=${window.location.origin}`;
          } catch (error) {
              console.error("Error during logout:", error);
              // Handle error (e.g., show a message to the user)
          }
      };
   if (loading) {
        return <p>Loading...</p>;
    }   
    return (
        <UserContext.Provider value={{ user, authenticated, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};