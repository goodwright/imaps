import React from "react";
import PropTypes from "prop-types";

const PekaRbp = props => {

  const { rbp } = props;

  return (
    <div className="peka-rbp">
      {rbp}
    </div>
  );
};

PekaRbp.propTypes = {
  rbp: PropTypes.string.isRequired
};

export default PekaRbp;