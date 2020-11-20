//import { ApolloLink } from "apollo-link";
//import { onError } from "apollo-link-error";
import { ApolloClient, InMemoryCache, ApolloLink, terminalLink, HttpLink } from "@apollo/client";
//import { createUploadLink } from "apollo-upload-client";

export const isDevelopment = () => {
  /**
   * Returns true if app is running locally.
   */
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
}


export const getApiLocation = () => {
  /**
   * Gets the URL of the API.
   */

  if (isDevelopment()) {
    return "http://localhost:8019/graphql";
  } else {
    return "https://api.imaps.goodwright.org/graphql";
  }
}


export const getMediaLocation = () => {
  /**
   * Gets the URL of the media server.
   */

  if (isDevelopment()) {
    return "http://localhost:8019/media/";
  } else {
    return "https://static.imaps.goodwright.org/";
  }
}


export const makeClient = token => {
  /**
   * Creates an apollo client with automatic token insertion, and catchall
   * error handling.
   */


  const httpLink = new HttpLink({uri: getApiLocation()});

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => ({ headers: {
      authorization: token, ...headers
    }}));
    return forward(operation);
  });

  const link = ApolloLink.from([authLink, httpLink]);

  return new ApolloClient({link: link, cache: new InMemoryCache()});
}
