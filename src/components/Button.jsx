import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ClipLoader from "react-spinners/ClipLoader";

const Button = props => {

  const { loading, className, required, type, onClick, children } = props;

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (loading) {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    } else {
      setWidth(0);
      setHeight(0);
    }
  }, [loading]);

  return (
    <button className={`${loading ? "flex items-center justify-center" : ""} ${className || ""}`} required={required} type={type} ref={ref} onClick={onClick} style={{
      width: width ? width: null, height: height ? height : null, padding: width && height ? 0 : null,
    }}>
      {height && width ? <ClipLoader color="white" css={`width: ${height / 2}px; height: ${height / 2}px;`}/> : children}
    </button>
  );
};

Button.propTypes = {
  loading: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;