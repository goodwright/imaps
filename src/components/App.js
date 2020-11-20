import React, { useState } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Route } from "react-router";
import HomePage from "../pages/HomePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import { ApolloProvider, useQuery } from "@apollo/client";
import { makeClient } from "../api";
import { TokenContext } from "../contexts";
import { UserContext } from "../contexts";
import { USER } from "../queries";
import Div100vh from "react-div-100vh";

const App = () => {

  const [token, setToken] = useState(null);
  const client = makeClient(token);

  return (
    <ApolloProvider client={client}>
      <TokenContext.Provider value={setToken}>
        <ApolloApp />
      </TokenContext.Provider>
    </ApolloProvider>
  );
};

const ApolloApp = () => {

  const { loading, data } = useQuery(USER);
  const user = loading || !data ? null : data.user;
  
  if (loading) {
    return (
      <Div100vh className="loading-page">
        <PropagateLoader color="#7A6ADB" />
      </Div100vh>
    )
  }

  return (
    <UserContext.Provider value={user}>
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