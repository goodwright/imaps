import React from "react";
import useDocumentTitle from "@rehooks/document-title";
import PasswordResetForm from "../components/PasswordResetForm";
import Div100vh from "react-div-100vh";

const PasswordResetPage = () => {

  useDocumentTitle("iMaps - Reset Your Password");

  return (
    <Div100vh className="password-reset-page">
      <PasswordResetForm />
    </Div100vh>
  );
};

PasswordResetPage.propTypes = {
  
};

export default PasswordResetPage;