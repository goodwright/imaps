import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import Div100vh from "react-div-100vh";

const SignupPage = () => {

  return (
    <Div100vh className="signup-page">
      <div className="signup-grid">
        <SignupForm />
        <div className="welcome-text">
          <p>Welcome to iMaps. iMaps is an analysis platform for studies of protein-RNA interactions and RNA modifications.</p>
          <p>iMaps can be used with all variants of CLIP to interrogate RNA-protein interactions, RNA methylation and other modifications.</p>
          <p>iMaps is a resource of raw and processed public CLIP data. Start by exploring some of the data, or read about bioinformatic challenges of CLIP data.</p>
          <Link to="/" className="home-link">Explore as a guest</Link>
        </div>

      </div>
    </Div100vh>
  );
};

SignupPage.propTypes = {
  
};

export default SignupPage;