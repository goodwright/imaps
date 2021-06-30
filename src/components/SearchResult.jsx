import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";

const SearchResult = props => {

  const { query, collection, sample, execution, group, user } = props;

  const splitString = (s, query, truncate) => {
    const loc = s.toLowerCase().search(query.toLowerCase());
    if (loc === -1) return [s, "", ""];
    let pre = s.substring(0, loc);
    const within = s.substring(loc, loc + query.length);
    let post = s.substring(loc + query.length);
    if (truncate && pre.length > 30)
      pre = "..." + pre.slice(pre.length - 27).trimStart();
    if (truncate && post.length > 30)
      post = post.slice(0, 27).trimEnd() + "...";
    return [pre, within, post]
  }

  if (collection) {
    const [namePre, nameWithin, namePost] = splitString(collection.name, query);
    const [descriptionPre, descriptionWithin, descriptionPost] = splitString(collection.description, query, true);
    return (
      <Link className="overflow-hidden block px-2 py-3 bg-white hover:bg-gray-100 hover:no-underline" to={`/collections/${collection.id}/`}>
        <div className="text-xs font-medium text-primary-600">Collection</div>
        <div className="font-medium text-primary-200 whitespace-nowrap">{namePre}<span className="text-primary-500">{nameWithin}</span>{namePost}</div>
        <div className="text-xs text-primary-100">
          {moment(collection.created * 1000).format("D MMM, YYYY")}{descriptionWithin.length > 0 && <span> · {descriptionPre}<span className="text-primary-500">{descriptionWithin}</span>{descriptionPost}</span>}
        </div>
      </Link>
    )
  }

  if (sample) {
    const [namePre, nameWithin, namePost] = splitString(sample.name, query);
    const [organismPre, organismWithin, organismPost] = splitString(sample.organism, query, true);
    return (
      <Link className="overflow-hidden block px-2 py-3 bg-white hover:bg-gray-100 hover:no-underline" to={`/samples/${sample.id}/`}>
        <div className="text-xs font-medium text-primary-600">Sample</div>
        <div className="font-medium text-primary-200 whitespace-nowrap">{namePre}<span className="text-primary-500">{nameWithin}</span>{namePost}</div>
        <div className="text-xs text-primary-100">
          {moment(sample.created * 1000).format("D MMM, YYYY")}{organismWithin.length > 0 && <span> · {organismPre}<span className="text-primary-500">{organismWithin}</span>{organismPost}</span>}
        </div>
      </Link>
    )
  }

  if (execution) {
    const [pre, within, post] = splitString(execution.name, query);
    return (
      <Link className="overflow-hidden block px-2 py-3 bg-white hover:bg-gray-100 hover:no-underline" to={`/executions/${execution.id}/`}>
        <div className="text-xs font-medium text-primary-600">Execution</div>
        <div className="font-medium text-primary-200 whitespace-nowrap">{pre}<span className="text-primary-500">{within}</span>{post}</div>
        <div className="text-xs text-primary-100">
          {moment(execution.created * 1000).format("D MMM, YYYY")}
        </div>
      </Link>
    )
  }

  if (group) {
    const [namePre, nameWithin, namePost] = splitString(group.name, query);
    const [descriptionPre, descriptionWithin, descriptionPost] = splitString(group.description, query, true);
    return (
      <Link className=" overflow-hidden block px-2 py-3 bg-white hover:bg-gray-100 hover:no-underline" to={`/@${group.slug}/`}>
        <div className="text-xs font-medium text-primary-600">Group</div>
        <div className="font-medium text-primary-200 whitespace-nowrap">{namePre}<span className="text-primary-500">{nameWithin}</span>{namePost}</div>
        {descriptionWithin.length > 0 && <div className="text-xs text-primary-100">{descriptionPre}<span className="text-primary-500">{descriptionWithin}</span>{descriptionPost}</div>}
      </Link>
    )
  }

  if (user) {
    const [pre, within, post] = splitString(user.name, query);
    return (
      <Link className="overflow-hidden block px-2 py-3 bg-white hover:bg-gray-100 hover:no-underline" to={`/users/${user.username}/`}>
        <div className="text-xs font-medium text-primary-600">User</div>
        <div className="font-medium text-primary-200 whitespace-nowrap">{pre}<span className="text-primary-500">{within}</span>{post}</div>
      </Link>
    )
  }
};

SearchResult.propTypes = {
  collection: PropTypes.object,
  sample: PropTypes.object,
  execution: PropTypes.object,
  user: PropTypes.object,
  group: PropTypes.object,
  query: PropTypes.string.isRequired,
};

export default SearchResult;