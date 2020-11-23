import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Route } from "react-router";
import HomePage from "../pages/HomePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import { makeClient, getApiLocation } from "../api";
import { TokenContext } from "../contexts";
import { UserContext } from "../contexts";
import { USER } from "../queries";
import { REFRESH } from "../mutations";
import Div100vh from "react-div-100vh";

const App = () => {

  // Store the access token as a root level state variable
  const [token, setToken] = useState(null);

  // Store the user object as a record of whether logged in - an object if yes,
  // false if no, null if unknown
  const [user, setUser] = useState(null);

  // Create a client from the current access token
  const client = makeClient(token);

  const [refresh,] = useMutation(REFRESH, {
    client,
    onCompleted: data => {
      if (data.refreshToken) {
        setToken(data.refreshToken.accessToken);
        setUser(data.refreshToken.user);
      } else {
        setUser(false);
        setToken(null);
      }
    },
    onError: () => {
      setUser(false);
      setToken(null);
    }
  });

  // Keep access token up to date
  useEffect(() => {
    setInterval(refresh, 5000)
  }, []);

  return (
    <ApolloProvider client={client}>
      <TokenContext.Provider value={setToken}>
        <ApolloApp user={user} setUser={setUser} />
      </TokenContext.Provider>
    </ApolloProvider>
  );
};

const ApolloApp = props => {

  const { user, setUser } = props;

  // Need to know if logged in. If this hasn't been established yet, request the
  // user object.
  const { loading } = useQuery(USER, {
    skip: user !== null,
    onCompleted: data => {
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(false);
      }
    },
    onError: () => setUser(false)
  });

  // Show loading while waiting
  if (loading) {
    return (
      <Div100vh className="loading-page">
        <PropagateLoader color="#7A6ADB" />
      </Div100vh>
    )
  }
  
  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/privacy/" exact>
            <PrivacyPolicyPage />
          </Route>
          <Route path="/terms/" exact>
            <TermsPage />
          </Route>
          <Route path="/signup/" exact>
            <SignupPage />
          </Route>
          <Route path="/login/" exact>
            <LoginPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  )

}

App.propTypes = {
    
};

export default App;