import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { USER } from "../queries";
import Base from "./Base";
import UserSummary from "../components/UserSummary";
import SettingsForm from "../components/SettingsForm";
import AccountDeletion from "../components/AccountDeletion";

const SettingsPage = () => {

  return (
    <Base className="settings-page">
      <h1>Settings</h1>
      <SettingsForm />
      <AccountDeletion />
    </Base>
  );
};

SettingsPage.propTypes = {
  
};

export default SettingsPage;