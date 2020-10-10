import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = props => {
    return (
        <div>
            <Link to="/">Home</Link>
            Privacy Policy
        </div>
    );
};

PrivacyPolicyPage.propTypes = {
    
};

export default PrivacyPolicyPage;