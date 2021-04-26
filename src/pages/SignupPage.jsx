import React from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "@rehooks/document-title";
import SignupForm from "../components/SignupForm";
import Div100vh from "react-div-100vh";

const SignupPage = () => {

  useDocumentTitle("iMaps - Sign Up");

  return (
    <Div100vh className="signup-page">
      <div className="signup-grid">
        <SignupForm />
        <div className="welcome-text">
          <p>Welcome to iMaps. iMaps is an analysis platform for studies of protein-RNA interactions and RNA modifications.</p>
          <p>iMaps can be used with all variants of CLIP to interrogate RNA-protein interactions, RNA methylation and other modifications.</p>
          <p>iMaps is a resource of raw and processed public CLIP data. Start by exploring some of the data, or read about <a href="https://www.annualreviews.org/doi/full/10.1146/annurev-biodatasci-080917-013525">the bioinformatic challenges of CLIP data</a>.</p>
          <Link to="/" className="home-link">Explore as a guest</Link>
        </div>

      </div>
    </Div100vh>
  );
};

SignupPage.propTypes = {
  
};

export default SignupPage;