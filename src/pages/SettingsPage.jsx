import React, { useContext } from "react";
import Base from "./Base";
import { useDocumentTitle } from "../hooks";
import SettingsForm from "../components/SettingsForm";
import AccountDeletion from "../components/AccountDeletion";
import GroupsList from "../components/GroupsList";
import { UserContext } from "../contexts";
import UserImageEditor from "../components/UserImageEditor";

const SettingsPage = () => {

  useDocumentTitle("iMaps - Settings");

  const [user,] = useContext(UserContext)

  return (
    <Base className="settings-page">
      <h1>Settings</h1>

      <SettingsForm className="mt-10 mb-10 lg:mb-16" />

      <div className="grid grid-reverse gap-16 border-t pt-8 w-max lg:grid-cols-max lg:pt-16 mb-16 lg:gap-36 xl:gap-60">
        <div>
          <h2 className="text-primary-200 text-xl mb-3 md:mb-4">Groups</h2>
          <GroupsList user={user} editable={true} noMessage="You are not a member of any groups." />
        </div>
        <UserImageEditor user={user} />
      </div>

      <AccountDeletion />
    </Base>
  );
};

SettingsPage.propTypes = {
  
};

export default SettingsPage;