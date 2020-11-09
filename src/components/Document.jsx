import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import BeatLoader from "react-spinners/BeatLoader";
import ReactMarkdown from "react-markdown";

const Document = props => {
  const { markdown } = props;

  const className = classNames({document: true, loading: !markdown});

  return (
    <div className={className}>
      {markdown ? <ReactMarkdown source={markdown} /> : <BeatLoader css="display: block;" color="#7A6ADB"/>}
    </div>
  );
};

Document.propTypes = {
  markdown: PropTypes.string
};

export default Document;