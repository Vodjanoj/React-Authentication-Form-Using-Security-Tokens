import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  // getting current timestamp in milliseconds
  const currentTime = new Date().getTime();
  
  // passing expiration time to new date to convert it to a date object
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

export const AuthContextProvider = (props) => {
  // we don't need useEffect here becase localStorage is synchronous API
  // when page is being refreshed we check whether our token is located in local storage or not
  // we can just set the initial token value by looking into local storage. And initial value will only be used once by React when this state is first initialized.
  // So if that runs thereafter we won't overwrite any state changes with that token.
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);

  //  !!token might look strange, but this simply converts this truthy or falsy value to a true or false Boolean value.
  // If token is a string that's not empty, this will return true, if token is a string that is empty, this will return false
  // That's a default JavaScript trick you could say.
  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // we save token in local storage to keep a user logged in after a page refresh
    localStorage.setItem("token", token);

    const remainingTime = calculateRemainingTime(expirationTime);

    setTimeout(logoutHandler, remainingTime)
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
