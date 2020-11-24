import React, {useEffect } from "react";
import LoginForm from "../components/LoginForm";
import Div100vh from "react-div-100vh";

const LoginPage = () => {

  useEffect(() => {
    document.title = "iMaps - Sign In";
  });

  return (
    <Div100vh className="login-page">
      <LoginForm />
    </Div100vh>
  );
};

LoginPage.propTypes = {
  
};

export default LoginPage;