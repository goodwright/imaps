import React, {useEffect, useContext } from "react";
import Base from "./Base";
import SettingsForm from "../components/SettingsForm";
import AccountDeletion from "../components/AccountDeletion";
import GroupsList from "../components/GroupsList";
import { UserContext } from "../contexts";

const SettingsPage = () => {

  useEffect(() => {
    document.title = "iMaps - Settings";
  });

  const [user,] = useContext(UserContext)

  return (
    <Base className="settings-page">
      <h1>Settings</h1>
      <SettingsForm />
      <GroupsList user={user} editable={true} />
      <AccountDeletion />
    </Base>
  );
};

SettingsPage.propTypes = {
  
};

export default SettingsPage;