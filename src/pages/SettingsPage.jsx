import React, {useEffect } from "react";
import Base from "./Base";
import SettingsForm from "../components/SettingsForm";
import AccountDeletion from "../components/AccountDeletion";

const SettingsPage = () => {

  useEffect(() => {
    document.title = "iMaps - Settings";
  });

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