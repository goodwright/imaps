import React, { useState } from "react";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";
import { ApolloProvider, useQuery } from "@apollo/client";
import PropagateLoader from "react-spinners/PropagateLoader";
import Div100vh from "react-div-100vh";
import { makeClient } from "../api";
import { TOKEN, USER } from "../queries";
import { UserContext } from "../contexts";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import DocumentPage from "../pages/DocumentPage";
import privacy from "../documents/privacy.md";
import terms from "../documents/terms.md";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import SettingsPage from "../pages/SettingsPage";
import PageNotFound from "../pages/PageNotFound";
import GroupPage from "../pages/GroupPage";
import NewGroupPage from "../pages/NewGroupPage";
import CollectionPage from "../pages/CollectionPage";
import CollectionsPage from "../pages/CollectionsPage";
import UserCollectionsPage from "../pages/UserCollectionsPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import SamplePage from "../pages/SamplePage";
import ExecutionPage from "../pages/ExecutionPage";
import SearchPage from "../pages/SearchPage";
import PekaPage from "../peka/PekaPage";
import NewCollectionPage from "../pages/NewCollectionPage";
import AnalysisPage from "../pages/AnalysisPage";
import CommandPage from "../pages/CommandPage";

const client = makeClient();
const colors = require("../colors").colors;

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
    onCompleted: data => setUser(data.user || false)
  })

  // While token request loading, or log-in status is unknown, show loading page
  if (tokenQuery.loading || user === null) {
    return (
      <Div100vh className="flex items-center justify-center">
        <PropagateLoader color={colors.primary[400]} />
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
              <DocumentPage document={privacy} title="Privacy Policy" />
            </Route>
            <Route path="/terms/" exact>
            <DocumentPage document={terms} title="Terms of Use" />
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
            {user && <Route path="/collections/new/" exact>
              <NewCollectionPage />
            </Route>}
            <Route path="/collections/:id(\d+)/" exact>
              <CollectionPage />
            </Route>
            {user && <Route path="/collections/:id(\d+)/edit/" exact>
              <CollectionPage edit={true} />
            </Route>}
            <Route path="/collections/" exact>
              <CollectionsPage />
            </Route>
            {user && <Route path="/user-collections/" exact>
              <UserCollectionsPage />
            </Route>}
            <Route path="/samples/:id(\d+)/" exact>
              <SamplePage />
            </Route>
            {user && <Route path="/samples/:id(\d+)/edit/" exact>
              <SamplePage edit={true} />
            </Route>}
            <Route path="/executions/:id(\d+)/" exact>
              <ExecutionPage />
            </Route>
            {user && <Route path="/executions/:id(\d+)/edit/" exact>
              <ExecutionPage edit={true} />
            </Route>}
            <Route path="/search/" exact>
              <SearchPage />
            </Route>
            {user && <Route path="/analysis/" exact>
              <AnalysisPage />
            </Route>}
            {user && <Route path="/commands/:id(\d+)/" exact>
              <CommandPage />
            </Route>}
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