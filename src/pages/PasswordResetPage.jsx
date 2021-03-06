import React from "react";
import { useDocumentTitle } from "../hooks";
import PasswordResetForm from "../components/PasswordResetForm";
import Div100vh from "react-div-100vh";

const PasswordResetPage = () => {

  useDocumentTitle("iMaps - Reset Your Password");

  return (
    <Div100vh className="flex items-center justify-center">
      <PasswordResetForm />
    </Div100vh>
  );
};

PasswordResetPage.propTypes = {
  
};

export default PasswordResetPage;