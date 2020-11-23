import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { USER } from "../queries";
import Base from "./Base";
import UserSummary from "../components/UserSummary";

const UserPage = () => {

  const userId = useRouteMatch("/@:id").params.id;
  
  const { loading, data, error } = useQuery(USER, {
    variables: {username: userId}
  });

  if (loading) {
    return (
      <Base className="user-page" loading={true} />
    );
  }

  const user = data.user;

  return (
    <Base className="user-page">
      <UserSummary user={user} />
    </Base>
  );
};

UserPage.propTypes = {
  
};

export default UserPage;