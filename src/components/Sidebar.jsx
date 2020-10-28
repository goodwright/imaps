import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = props => {
  return (
    <div className="sidebar">
      <div className="user">
        Guest
      </div>
      <div className="options">
        Options
      </div>
      <div className="goodwright">
        goodwright
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  
};

export default Sidebar;