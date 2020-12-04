import React, {useEffect } from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { USER } from "../queries";
import Base from "./Base";
import UserSummary from "../components/UserSummary";
import GroupsList from "../components/GroupsList";
import PageNotFound from "./PageNotFound";

const UserPage = () => {

  const userId = useRouteMatch("/users/:id").params.id;
  
  const { loading, data, error } = useQuery(USER, {
    variables: {username: userId}
  });

  useEffect(() => {
    document.title = `iMaps${data && data.user ? " - " + data.user.name : ""}`;
  });

  if (error && error.graphQLErrors && error.graphQLErrors.length) {
    const message = JSON.parse(error.graphQLErrors[0].message);
    if (message && Object.values(message).some(m => m === "Does not exist")) {
      return <PageNotFound />
    }
  }

  if (loading) {
    return <Base className="user-page" loading={true} />
  }

  const user = data.user;

  return (
    <Base className="user-page">
      <UserSummary user={user} />
      <GroupsList user={user} />

      

    </Base>
  );
};

UserPage.propTypes = {
  
};

export default UserPage;