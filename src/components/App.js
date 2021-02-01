import React, { useState } from "react";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import { ApolloProvider, useQuery } from "@apollo/client";
import PropagateLoader from "react-spinners/PropagateLoader";
import Div100vh from "react-div-100vh";
import { makeClient } from "../api";
import { UserContext } from "../contexts";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import SettingsPage from "../pages/SettingsPage";
import PageNotFound from "../pages/PageNotFound";
import GroupPage from "../pages/GroupPage";
import NewGroupPage from "../pages/NewGroupPage";
import CollectionPage from "../pages/CollectionPage";
import CollectionsPage from "../pages/CollectionsPage";
import { TOKEN, USER } from "../queries";
import UserCollectionsPage from "../pages/UserCollectionsPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import SamplePage from "../pages/SamplePage";
import PekaPage from "../pages/PekaPage";

const client = makeClient();

const App = () => {

  // Keep track of whether there is a logged in user
  const [user, setUser] = useState(null);

  // Send request for access token
  const tokenQuery = useQuery(TOKEN, {client, pollInterval: 1000 * 60 * 2});

  // If the token query has fired at least once, and log-in status is unknown,
  // try to get user
  useQuery(USER, {
    client,
    skip: tokenQuery.loading || user !== null,
    onCompleted: data => setUser(data.user),
    onError: () => setUser(false)
  })

  // While token request loading, or log-in status is unknown, show loading page
  if (tokenQuery.loading || user === null) {
    return (
      <Div100vh className="loading-page">
        <PropagateLoader color="#7A6ADB" />
      </Div100vh>
    )
  }

  // Otherwise return the normal app with the log-in status set
  return (
    <ApolloProvider client={client}>
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
            <Route path="/password-reset/" exact>
              <PasswordResetPage />
            </Route>
            {user && <Route path="/settings/" exact>
              <SettingsPage />
            </Route>}
            {user && <Route path="/groups/new/" exact>
              <NewGroupPage />
            </Route>}
            <Route path="/users/:id/" exact>
              <UserPage />
            </Route>
            <Route path="/@:id/" exact>
              <GroupPage />
            </Route>
            {user && <Route path="/@:id/edit/" exact>
              <GroupPage edit={true} />
            </Route>}
            <Route path="/collections/:id/" exact>
              <CollectionPage />
            </Route>
            <Route path="/collections/" exact>
              <CollectionsPage />
            </Route>
            {user && <Route path="/user-collections/" exact>
              <UserCollectionsPage />
            </Route>}
            <Route path="/samples/:id/" exact>
              <SamplePage />
            </Route>
            <Route path="/apps/peka/" exact>
              <PekaPage />
            </Route>
            <Route><PageNotFound /></Route>
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </ApolloProvider>
  )
}

App.propTypes = {
    
};

export default App;