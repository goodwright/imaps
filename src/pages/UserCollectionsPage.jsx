import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import useDocumentTitle from "@rehooks/document-title";
import { USER_COLLECTIONS } from "../queries";
import Base from "./Base";
import CollectionsGrid from "../components/CollectionsGrid";
import { UserContext } from "../contexts";
import Paginator from "../components/Paginator";

const UserCollectionsPage = () => {

  const { loading, data } = useQuery(USER_COLLECTIONS);
  const [user,] = useContext(UserContext);
  const [ownPage, setOwnPage] = useState(1);
  const [sharedPage, setSharedPage] = useState(1);
  const [groupPages, setGroupPages] = useState(null);
  const PER_PAGE = user.memberships.length ? 6 : 12;

  useDocumentTitle("iMaps - Your Collections");

  if (loading) {
    return <Base className="user-collections-page" loading={true} />
  }

  const collections = data.userCollections;
  const ownedCollections = collections.filter(c => c.owners.map(o => o.id).includes(user.id));
  const sharedCollections = data.user.collections.filter(c => !c.owners.map(o => o.id).includes(user.id));
  
  return (
    <Base className="user-collections-page">
      <h2>Collections you Own</h2>
      {ownedCollections.length > PER_PAGE && <Paginator
        count={ownedCollections.length} itemsPerPage={PER_PAGE}
        currentPage={ownPage} onClick={setOwnPage}
      />}
      <CollectionsGrid collections={ownedCollections.slice((ownPage - 1) * PER_PAGE, ownPage * PER_PAGE)} />

      <h2>Collections Shared with You</h2>
      {sharedCollections.length > PER_PAGE && <Paginator
        count={sharedCollections.length} itemsPerPage={PER_PAGE}
        currentPage={sharedPage} onClick={setSharedPage}
      />}
      <CollectionsGrid collections={sharedCollections.slice((sharedPage - 1) * PER_PAGE, sharedPage * PER_PAGE)} />

      {user.memberships.map((group, g) => {
        const groupCollections = collections.filter(c => c.groups.map(g => g.id).includes(group.id));
        return (
          <div className="group-owned" key={g}>
            <h2>Collections Shared with {group.name}</h2>
            {groupCollections.length > PER_PAGE && <Paginator
              count={groupCollections.length} itemsPerPage={PER_PAGE}
              currentPage={groupPages ? groupPages[g] : 1}
              onClick={n => setGroupPages(groupPages ? groupPages.map((x, i) => i === g ? n : x) : user.groups.map((x, i) => i === g ? n : 1))}
            />}
            <CollectionsGrid collections={groupCollections.slice(((groupPages ? groupPages[g] : 1) - 1) * PER_PAGE, (groupPages ? groupPages[g] : 1 )* PER_PAGE)} />
          </div>
        )
      })}

    </Base>
  );
};

UserCollectionsPage.propTypes = {

};

export default UserCollectionsPage;