import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { useDocumentTitle } from "../hooks";
import { PUBLIC_USER } from "../queries";
import Base from "./Base";
import UserSummary from "../components/UserSummary";
import GroupsList from "../components/GroupsList";
import CollectionsGrid from "../components/CollectionsGrid";
import PageNotFound from "./PageNotFound";
import { detect404 } from "../forms";
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

  const h2Class = "text-primary-200 text-xl mb-3 md:mb-4";

  return (
    <Base>
      <UserSummary user={user} size={20} sm={24} className="mb-6 lg:mb-12">
        <div className="text-2xl leading-7 sm:text-3xl text-primary-700">{user.name}</div>
        <div className="text-sm text-primary-200 sm:text-lg">{user.username}</div>
      </UserSummary>

      <div className="xl:grid xl:grid-cols-max xl:gap-20 xl:mb-16">

        <div className="mb-10 xl:mb-0">
          <h2 className={h2Class}>Groups</h2>
          <GroupsList user={user} noMessage="User is not a member of any groups." />
        </div>

        <div className="mb-10 xl:mb-0">
          <h2 className={h2Class}>Uploads</h2>
          <ExecutionTable executions={user.uploads} noMessage="User has no viewable uploads." />
        </div>
      </div>

      <div>
        <h2 className={h2Class}>Public Collections</h2>
        <CollectionsGrid
          collections={user.publicCollections}
          noMessage="User has no collections."
          pageLength={12}
        />
      </div>

    </Base>
  );
};

UserPage.propTypes = {
  
};

export default UserPage;