import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/client";
import { TOKEN } from "../queries";
import { SIGNUP } from "../mutations";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Logo from "./Logo";
import Button from "./Button";

const SignupForm = props => {

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [,setUser] = useContext(UserContext);
  const history = useHistory();
  const client = useApolloClient();

  const [signup, signupMutation] = useMutation(SIGNUP, {
    onCompleted: data => {
      setUser(data.signup.user);
      client.cache.writeQuery({
        query: TOKEN, data: {accessToken: data.signup.accessToken}
      });
      history.push("/");
    },
    
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const formSubmit = e => {
    e.preventDefault();
    signup({
      variables: {username, password, name, email}
    });
  }

  return (
    <form className={`bg-primary-400 px-8 py-12 w-full h-full relative sm:rounded-lg sm:max-w-md sm:h-auto sm:px-12 ${props.className || ""}`} onSubmit={formSubmit}>
      <Logo inverted={true} showGoodwright={true} className="mx-auto mb-10" svgClassName="h-16 sm:h-20" />

      {errors.general && <div className="text-red-800 mb-1 text-xs ml-16 pl-3">There was an error.</div>}

      {errors.username && <div className="text-red-800 mb-1 text-xs ml-16 pl-3 font-medium -mt-2">{errors.username}</div>}
      <div className={`flex items-center mb-8 w-full`}>
        <label htmlFor="username" className="text-white mr-3 w-16 block text-right">username</label>
        <input
          className={`big-input bg-white text-primary-500 font-medium flex-grow ${errors.username ? "error" : ""}`}
          type="text"
          id="username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoCapitalize="none"
          autoComplete="username"
        />

      </div>

      {errors.name && <div className="text-red-800 mb-1 text-xs ml-16 pl-3 font-medium -mt-2">{errors.name}</div>}
      <div className="flex items-center mb-8 w-full">
        <label htmlFor="name" className="text-white mr-3 block w-16 block text-right">name</label>

        <input
          className={`big-input bg-white text-primary-500 font-medium flex-grow ${errors.name ? "error" : ""}`}
          type="text"
          id="name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

      {errors.email && <div className="text-red-800 mb-1 text-xs ml-16 pl-3 font-medium -mt-2">{errors.email}</div>}
      <div className="flex items-center mb-8 w-full">
        <label htmlFor="email" className="text-white mr-3 w-16 text-right">email</label>

        <input
          className={`big-input bg-white text-primary-500 font-medium flex-grow ${errors.email ? "error" : ""}`}
          type="email"
          id="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      {errors.password && <div className="text-red-800 mb-1 text-xs ml-16 pl-3 font-medium -mt-2">{errors.password}</div>}
      <div className="flex items-center mb-8 w-full">
        <label htmlFor="password" className="text-white mr-3 w-16 text-right">password</label>
        <input
          className={`big-input bg-white text-primary-500 font-medium block flex-grow ${errors.password ? "error" : ""}`}
          type="password"
          id="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      <div className="ml-16 pl-3 ">
        <Link className="block text-white cursor-pointer mb-7" to="/terms/">
          Terms and Conditions
        </Link>
        <Button
          type="submit"
          className="btn-primary bg-primary-500 w-36 py-2 rounded-md text-lg font-medium hover:bg-primary-600"
          loading={signupMutation.loading}
        >Sign Up</Button>

      </div>
      <Link className="absolute text-white right-5 bottom-5 text-lg" to="/login/">Log In</Link>
    </form>
  );
};

SignupForm.propTypes = {
  
};

export default SignupForm;