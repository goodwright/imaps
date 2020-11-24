import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import { ApolloProvider, useMutation } from "@apollo/client";
import PropagateLoader from "react-spinners/PropagateLoader";
import Div100vh from "react-div-100vh";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import { makeClient } from "../api";
import { TokenContext, UserContext } from "../contexts";
import { REFRESH } from "../mutations";
import SettingsPage from "../pages/SettingsPage";
import PageNotFound from "../pages/PageNotFound";

const App = () => {

  // Store the access token as a root level state variable, and make a client
  // with it.
  const [token, setToken] = useState(null);
  const client = makeClient(token);

  // Create a root user object that will indicate whether there is anyone logged
  // in. This will be false if not logged in, null if unknown.
  const [user, setUser] = useState(null);

  // Find out if logged in by trying to get an access token via refresh
  const [refresh,] = useMutation(REFRESH, {
    client,
    onCompleted: data => {
      if (data.refreshToken) {
        setUser(data.refreshToken.user);
        setToken(data.refreshToken.accessToken);
      } else {
        setUser(false);
        setToken(null);
      }
    },
    onError: () => {
      setUser(false);
      setToken(null);
    },
  });
  if (user === null) refresh();

  // try to refresh the token at intervals
  useEffect(() => {
    setInterval(() => {
      refresh()
    }, 1000 * 60 * 5)
  }, []);

  // While waiting to find out if logged in, show a loading page
  if (user === null) {
    return (
      <Div100vh className="loading-page">
        <PropagateLoader color="#7A6ADB" />
      </Div100vh>
    )
  }

  return (
    <ApolloProvider client={client}>
      <TokenContext.Provider value={setToken}>
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
              {user && <Route path="/settings/" exact>
                <SettingsPage />
              </Route>}
              <Route path="/@:id/" exact>
                <UserPage />
              </Route>
              <Route><PageNotFound /></Route>
            </Switch>
          </BrowserRouter>
        </UserContext.Provider>
      </TokenContext.Provider>
    </ApolloProvider>
  );
}

App.propTypes = {
    
};

export default App;