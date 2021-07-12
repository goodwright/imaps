import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useDocumentTitle } from "../hooks";
import { USER_COLLECTIONS } from "../queries";
import Base from "./Base";
import CollectionsGrid from "../components/CollectionsGrid";
import { UserContext } from "../contexts";

const UserCollectionsPage = () => {

  const { loading, data } = useQuery(USER_COLLECTIONS);
  const [user,] = useContext(UserContext);

  useDocumentTitle("iMaps - Your Collections");

  if (loading) return <Base loading={true} />

  const collections = data.userCollections;
  const ownedCollections = collections.filter(c => c.owners.map(o => o.id).includes(user.id));
  const sharedCollections = data.user.collections.filter(c => !c.owners.map(o => o.id).includes(user.id));

  const h2Class = "text-primary-200 text-xl mb-2 md:mb-3 md:text-2xl";
  
  return (
    <Base>
      <h1>Your Collections</h1>
      <div className="grid gap-10 md:gap-16 mt-6">
        <div>
          <h2 className={h2Class}>Collections you Own</h2>
          <CollectionsGrid
            collections={ownedCollections}
            pageLength={sharedCollections.length ? 6 : 12}
            noMessage="You don't currently own any collections."
          />
        </div>

        <div>
          <h2 className={h2Class}>Collections Shared with You</h2>
          <CollectionsGrid
            collections={sharedCollections} pageLength={ownedCollections.length ? 6 : 12} 
            noMessage="There aren't any additional collections shared with you."
          />
        </div>

        {user.memberships.map((group, g) => {
          const groupCollections = collections.filter(c => c.groups.map(g => g.id).includes(group.id));
          return (
            <div key={g}>
              <h2 className={h2Class}>Collections Shared with <span className="text-primary-300">{group.name}</span></h2>
              <CollectionsGrid
                collections={groupCollections}
                pageLength={user.memberships.length === 1 ? 12 : 6}
                noMessage="There are no collections shared with this group."
              />
            </div>
          )
        })}
      </div>
    </Base>
  );
};

UserCollectionsPage.propTypes = {

};

export default UserCollectionsPage;