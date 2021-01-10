import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import privacyIcon from "../images/private.svg";
import publicIcon from "../images/public.svg";

const CollectionCard = props => {

  const { collection } = props;

  const canBreak = !collection.name.includes(" ");

  return (
    <Link className="collection-card" to={`/collections/${collection.id}/`}>
      <div className="top-row">
        <div className={canBreak ? "name can-break" : "name"}>{collection.name}</div>
        <div className="created">{moment(collection.creationTime * 1000).format("D MMM, YYYY")} </div>
      </div>
      <div className="bottom-row">
        <div className="owner">
          {collection.owner.name}
          {collection.private === true && (
            <span className="privacy">
              <img src={privacyIcon} alt="private" />
              Private
            </span>
          )}
          {collection.private === false && (
            <span className="privacy">
              <img src={publicIcon} alt="public" />
              Public
            </span>
          )}
        </div>
        <div className="groups">{collection.groups.map(group => (
          <div className="group" key={group.slug}>@{group.slug}</div>
        ))}</div>
      </div>
    </Link>
  );
};

CollectionCard.propTypes = {
  collection: PropTypes.object.isRequired
}

export default CollectionCard;