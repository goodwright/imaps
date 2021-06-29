import React from "react";
import useDocumentTitle from "@rehooks/document-title";
import LoginForm from "../components/LoginForm";
import Div100vh from "react-div-100vh";

const LoginPage = () => {

  useDocumentTitle("iMaps - Sign In");

  return (
    <Div100vh className="flex items-center justify-center">
      <LoginForm />
    </Div100vh>
  );
};

LoginPage.propTypes = {
  
};

export default LoginPage;