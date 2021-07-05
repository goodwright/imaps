import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { GROUP } from "../queries";
import Base from "./Base";
import PageNotFound from "./PageNotFound";
import GroupDeletion from "../components/GroupDeletion";
import { UserContext } from "../contexts";
import UserInviter from "../components/UserInviter";
import { detect404 } from "../forms";
import CollectionsGrid from "../components/CollectionsGrid";
import UsersGrid from "../components/UsersGrid";
import GroupInfo from "../components/GroupInfo";

const GroupPage = props => {

  const { edit } = props;
  const [user] = useContext(UserContext);
  const groupId = useRouteMatch("/@:id").params.id;
  
  const { loading, data, error } = useQuery(GROUP, {
    variables: {slug: groupId}
  });

  useDocumentTitle(data ? `iMaps - ${data.group.name}` : "iMaps");

  if (detect404(error)) return <PageNotFound />

  if (loading) {
    return <Base className="group-page" loading={true} />
  }

  const group = data.group;
  const adminUsernames = group.admins.map(user => user.username);
  const users = [...group.members].map(user => (
    {...user, admin: adminUsernames.includes(user.username)}
  )).sort((u1, u2) => u2.admin - u1.admin);
  const allUsers = data.users;

  if (user && edit && !(adminUsernames.includes(user.username))) {
    return <PageNotFound />
  }

  const h2Class = "text-primary-200 text-xl mb-2 md:mb-3 md:text-2xl";

  return (
    <Base className="group-page">
      <GroupInfo
        group={group} editing={Boolean(edit)} className="mb-8 md:mb-12 "
        isAdmin={user && adminUsernames.includes(user.username)}
      />

      <UsersGrid
        group={group} users={users}
        adminUsernames={adminUsernames} invitees={edit ? group.invitees : null}
      />

      {!edit && <div>
        <h2 className={h2Class}>Public Collections</h2>
        <CollectionsGrid
          collections={group.publicCollections}
          noMessage="There are no public collections associated with this group."
          pageLength={12}
        />
      </div>}

      {edit && <UserInviter group={group} allUsers={allUsers} className="mb-20" /> }

      {edit && <GroupDeletion group={group} />}
    </Base>
  );
};

GroupPage.propTypes = {
  edit: PropTypes.bool
};

export default GroupPage;