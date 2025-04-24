import React, { createContext, useEffect, useState } from 'react';
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
            // console.log(`${process.env.REACT_APP_API_URL}`);
            try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, { 
              credentials: 'include' });
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
          const backendBaseUrl = process.env.REACT_APP_API_URL;
          window.location.href = `${backendBaseUrl}/api/private`;
        };

      //  const login = () => {
      //     const backendBaseUrl = process.env.REACT_APP_API_URL;
      //     const redirectUri = `${window.location.origin}/contacts`; // or wherever you want to go after login
      //     window.location.href = `${backendBaseUrl}/oauth2/authorization/auth0?redirect_uri=${redirectUri}`;
      //   };
  
        // const login = () => {
        //     const backendBaseUrl = process.env.REACT_APP_API_URL;
        //     // console.log(backendBaseUrl);
        //     // console.log(`${backendBaseUrl}/api/private`);
        //     // window.location.href = `${backendBaseUrl}/api/login`;
        //     // window.location.href = `${backendBaseUrl}/api/login?redirect_uri=${window.location.origin}`;
        //     // window.location.href = `${backendBaseUrl}/api/login?redirect_uri=${window.location.origin}/contacts`;
        //     // window.location.href = `${backendBaseUrl}/api/login?redirect_uri=${window.location.origin}/groups`;
        
        //   window.location.href = `${backendBaseUrl}/api/private`;
        // };
        
      const logout = async () => {
          try {
              const res = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
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