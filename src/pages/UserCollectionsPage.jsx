import React, { useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { USER_COLLECTIONS } from "../queries";
import Base from "./Base";
import CollectionsGrid from "../components/CollectionsGrid";
import { UserContext } from "../contexts";
import GroupCollections from "../components/GroupCollections";

const UserCollectionsPage = () => {

  const { loading, data } = useQuery(USER_COLLECTIONS);
  const [user,] = useContext(UserContext);

  useEffect(() => {
    document.title = `iMaps - Your Collections`;
  });

  if (loading) {
    return <Base className="user-collections-page" loading={true} />
  }

  const ownedCollections = data.user.ownedCollections;
  const sharedCollections = data.user.collections.filter(
    c => c.users.map(c => c.id).includes(user.id)
  );
  const groupObjects = new Set();
  for (let collection of sharedCollections) {
    for (let group of collection.groups) {
      if (user.groups.map(group => group.slug).includes(group.slug)) {
        groupObjects.add(group)
      }
    }
  }
  const groups = [...groupObjects].map(group => (
    {group, collections: sharedCollections.filter(
      collection => collection.groups.map(group => group.slug).includes(group.slug)
    )}
  )).sort((a, b) => a.length - b.length)

  return (
    <Base className="user-collections-page">
      <h2>Collections you Own</h2>
      <CollectionsGrid collections={ownedCollections} />

      <h2>Collections Shared with You</h2>
      <CollectionsGrid collections={sharedCollections} />

      {user.groups.map(group => (
        <GroupCollections group={group} />
      ))}

    </Base>
  );
};

UserCollectionsPage.propTypes = {

};

export default UserCollectionsPage;