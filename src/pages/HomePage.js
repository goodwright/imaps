import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HomePage = props => {
    return (
        <div>
            <Link to="/privacy/">Privacy Policy</Link>
            iMaps
        </div>
    );
};

HomePage.propTypes = {
    
};

export default HomePage;