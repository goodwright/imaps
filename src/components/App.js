import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch } from "react-router-dom";
import { Route } from "react-router";
import HomePage from "../pages/HomePage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";

const App = () => {
  return (
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
  );
};

App.propTypes = {
    
};

export default App;