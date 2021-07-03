import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { PUBLIC_USER } from "../queries";
import Base from "./Base";
import UserSummary from "../components/UserSummary";
import GroupsList from "../components/GroupsList";
import CollectionsGrid from "../components/CollectionsGrid";
import PageNotFound from "./PageNotFound";
import { detect404 } from "../forms";
import CollectionCard from "../components/CollectionCard";
import moment from "moment";
import ExecutionTable from "../components/ExecutionTable";

const UserPage = () => {

  const userId = useRouteMatch("/users/:id").params.id;
  
  const { loading, data, error } = useQuery(PUBLIC_USER, {
    variables: {username: userId}
  });

  useDocumentTitle(data ? `iMaps - ${data.user.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading) {
    return <Base className="user-page" loading={true} />
  }

  const user = data.user;

  return (
    <Base className="user-page">
      <UserSummary user={user} />

      <div className="user-grid">
        <GroupsList user={user} />
        <div className="collections">
          <h2>Public Collections</h2>
          <CollectionsGrid collections={user.publicCollections} noMessage="User has no collections." />
        </div>

        <div>
          <h2>Uploads</h2>

          <ExecutionTable executions={user.uploads} />
        </div>
      </div>
    </Base>
  );
};

UserPage.propTypes = {
  
};

export default UserPage;