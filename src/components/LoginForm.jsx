import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/client";
import { LOGIN } from "../mutations";
import { UserContext } from "../contexts";
import { TOKEN } from "../queries";
import Logo from "./Logo";
import PasswordResetRequest from "./PasswordResetRequest";
import Button from "./Button";

const LoginForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [,setUser] = useContext(UserContext);
  const history = useHistory();
  const [error, setError] = useState(false);
  const client = useApolloClient();

  const [login, loginMutation] = useMutation(LOGIN, {
    onCompleted: data => {
      setUser(data.login.user);
      client.cache.writeQuery({
        query: TOKEN, data: {accessToken: data.login.accessToken}
      });
      history.push("/");
    },
    onError: () => setError(true)
  });

  const formSubmit = e => {
    e.preventDefault();
    setError(false);
    login({
      variables: {username, password}
    });
  }

  return (
    <>
      <form className="bg-primary-400 px-8 py-12 w-full h-full relative sm:rounded-lg sm:max-w-md sm:h-auto sm:px-12" onSubmit={formSubmit}>
        <Logo inverted={true} showGoodwright={true} className="mx-auto mb-10" svgClassName="h-16 sm:h-20" />
        {error && <div className="ml-16 pl-3 mb-2 text-red-800 font-medium">Those credentials aren't valid.</div>}
        <div className={`flex items-center mb-8 w-full ${error ? "" : "pt-8"}`}>
          <label htmlFor="username" className="text-white mr-3 w-16 text-right">username</label>
          <input
            type="text"
            id="username"
            className={`big-input bg-white text-primary-500 flex-grow font-medium ${error ? "error" : ""}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
          />
        </div>

        <div className="flex items-center mb-8 w-full">
          <label htmlFor="password" className="text-white mr-3 w-16 text-right">password</label>
          <input
            type="password"
            id="password"
            value={password}
            className={`big-input bg-white text-primary-500 flex-grow font-medium ${error ? "error" : ""}`}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="ml-16 pl-3 ">
          <div className="text-white cursor-pointer mb-7" onClick={() => setShowModal(true)}>
            Forgot your password?
          </div>
          <Button
            type="submit"
            className="btn-primary bg-primary-500 w-36 py-2 rounded-md text-lg font-medium hover:bg-primary-600"
            loading={loginMutation.loading}
          >Log In</Button>

        </div>
        <Link className="absolute text-white right-5 bottom-5 text-lg" to="/signup/">Sign Up</Link>
      </form>
      <PasswordResetRequest showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

LoginForm.propTypes = {
  
};

export default LoginForm;