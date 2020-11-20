import React from "react";
import PropTypes from "prop-types";
import LoginForm from "../components/LoginForm";
import Div100vh from "react-div-100vh";

const LoginPage = () => {

  return (
    <Div100vh className="login-page">
      <LoginForm />
    </Div100vh>
  );
};

LoginPage.propTypes = {
  
};

export default LoginPage;