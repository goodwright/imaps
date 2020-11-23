import React, { useContext } from "react";
import { UserContext } from "../contexts";

const UserSummary = () => {

  const [user,] = useContext(UserContext);

  return (
    <div className="user-summary">
      <div className="user-info">
        <div className="user-photo">

        </div>
        <div className="user-name">
          {user ? user.name : "Guest"}
        </div>
      </div>
    </div>
  );
};

UserSummary.propTypes = {
  
};

export default UserSummary;