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
    <Link className={`flex flex-col justify-between bg-gray-50 p-3 rounded-md border border-gray-100 hover:no-underline hover:bg-gray-100 ${props.className || ""}`} to={`/collections/${collection.id}/`}>
      <div className="flex justify-between mb-2">
        <div className={`font-medium text-base ${canBreak && "break-words"} sm:text-lg`}>{collection.name}</div>
        <div className="text-primary-200 text-sm whitespace-nowrap ml-3">{moment(collection.created * 1000).format("D MMM, YYYY")} </div>
      </div>
      <div className="flex justify-between items-end text-primary-200">
        <div className="text-xs sm:text-sm">
          {collection.private === true && (
            <span className="flex items-center">
              <img src={privacyIcon} className="mr-1" alt="private" />
              Private
            </span>
          )}
          {collection.private === false && (
            <span className="flex items-center">
              <img src={publicIcon} className="mr-1" alt="public" />
              Public
            </span>
          )}
          {collection.private === undefined && collection.sampleCount !== undefined && (
            <div className="grid grid-cols-max gap-2">
              <div className="grid grid-cols-max items-baseline gap-1 mr-2"><img src={sampleIcon} alt="" className="h-6" />{collection.sampleCount}</div>
              <div className="grid grid-cols-max items-baseline gap-1"><img src={executionIcon} alt="" className="h-6" />{collection.executionCount}</div>
            </div>
          )}
        </div>
        <div className="text-sm text-primary-400 font-light">{collection.owners.map(owner => (
          <div key={owner.id}>{owner.username}</div>
        ))}</div>
      </div>
    </Link>
  );
};

CollectionCard.propTypes = {
  collection: PropTypes.object.isRequired
}

export default CollectionCard;