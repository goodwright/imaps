import React from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "@rehooks/document-title";
import SignupForm from "../components/SignupForm";
import Div100vh from "react-div-100vh";
const colors = require("../colors").colors;

const SignupPage = () => {

  useDocumentTitle("iMaps - Sign Up");

  return (
    <Div100vh className="md:flex lg:justify-center">
      <div className="h-full sm:flex sm:items-center sm:justify-center md:px-3 md:max-w-3xl md:mx-auto lg:max-w-6xl">
        <SignupForm className="md:mr-3 lg:mr-7"/>
        <div className="hidden leading-8 gap-5 text-sm font-normal md:w-max-content md:grid md:ml-3 lg:w-100 lg:ml-7 lg:text-lg lg:leading-9">
          <p>Welcome to iMaps. iMaps is an analysis platform for studies of protein-RNA interactions and RNA modifications.</p>
          <p>iMaps can be used with all variants of CLIP to interrogate RNA-protein interactions, RNA methylation and other modifications.</p>
          <p>iMaps is a resource of raw and processed public CLIP data. Start by exploring some of the data, or read about <a href="https://www.annualreviews.org/doi/full/10.1146/annurev-biodatasci-080917-013525">the bioinformatic challenges of CLIP data</a>.</p>
          <Link to="/" className="font-medium mt-3">
            Explore as a guest
            <svg className="ml-1 w-4 h-6 inline" viewBox="0 0 100 100" preserveAspectRatio="none" width="100" height="100">
              <path strokeWidth="15" stroke={colors.primary[500]} fill="none" d="M20 20, L80 50, L20 80"/>
            </svg>
          </Link>
        </div>
      </div>
    </Div100vh>
  );
};

SignupPage.propTypes = {
  
};

export default SignupPage;