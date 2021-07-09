import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import anonymousUser from "../images/anonymous-user.svg";

const UserSummary = props => {

  const { user, link, children, size, sm, md, pxSize, noGap } = props;

  const s2m = s =>  !children || noGap ? 0 : s > 36 ? 5 : s > 24 ? 4 : s > 14 ? 3 : s > 6 ? 2 : 1;
  const imageSrc =  user && user.image ? `${process.env.REACT_APP_FILES}/${user.image}` : anonymousUser;
  let className = `object-cover rounded-full bg-gray-200 mr-${s2m(size)} ${(!user || !user.image) ? "p-2" : ""}`;
  if (size) className += ` h-${size} w-${size} min-w-${size}`;
  if (size && sm) className += ` sm:h-${sm} sm:w-${sm} sm:min-w-${sm}`;
  if (sm) className += ` sm:mr-${s2m(sm)}`;
  if (size && md) className += ` md:h-${md} md:w-${md} md:min-w-${md}`;
  if (md) className += ` md:mr-${s2m(md)}`;
  const Element = link ? Link : "div";

  return (
    <Element
      className={`grid grid-cols-max items-center hover:no-underline ${props.className || ""}`}
      to={link ? `/users/${user.username}/` : null}
      style={props.style}
    >
      <img className={className} src={imageSrc} alt="" style={pxSize ? {
        width: pxSize, height: pxSize
      } : null} />
      <div>{children}</div>
    </Element>
  );
};

UserSummary.propTypes = {
  user: PropTypes.object,
  size: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  link: PropTypes.bool,
  noGap: PropTypes.bool,
  pxSize: PropTypes.number
};

export default UserSummary;