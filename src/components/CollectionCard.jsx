import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import privacyIcon from "../images/private.svg";
import publicIcon from "../images/public.svg";
import sampleIcon from "../images/sample.svg";
import executionIcon from "../images/execution.svg";

const CollectionCard = props => {

  const { collection } = props;

  const canBreak = !collection.name.includes(" ");

  return (
    <Link className="collection-card" to={`/collections/${collection.id}/`}>
      <div className="top-row">
        <div className={canBreak ? "name can-break" : "name"}>{collection.name}</div>
        <div className="created">{moment(collection.created * 1000).format("D MMM, YYYY")} </div>
      </div>
      <div className="bottom-row">
        <div className="owner">
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
          {collection.private === undefined && collection.sampleCount !== undefined && (
            <div className="data">
              <div className="samples"><img src={sampleIcon} alt="" />{collection.sampleCount}</div>
              <div className="executions"><img src={executionIcon} alt="" />{collection.executionCount}</div>
            </div>
          )}
        </div>
        <div className="owners">{collection.owners.map(owner => (
          <div className="owner" key={owner.id}>{owner.username}</div>
        ))}</div>
      </div>
    </Link>
  );
};

CollectionCard.propTypes = {
  collection: PropTypes.object.isRequired
}

export default CollectionCard;