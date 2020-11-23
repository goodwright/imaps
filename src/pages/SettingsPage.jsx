import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { USER } from "../queries";
import Base from "./Base";
import UserSummary from "../components/UserSummary";
import SettingsForm from "../components/SettingsForm";

const SettingsPage = () => {

  return (
    <Base className="settings-page">
      <h1>Settings</h1>
      <SettingsForm />
    </Base>
  );
};

SettingsPage.propTypes = {
  
};

export default SettingsPage;