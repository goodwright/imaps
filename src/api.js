import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { TOKEN } from "./queries";

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


export const makeClient = () => {
  /**
   * Creates an apollo client with automatic token insertion, and catchall
   * error handling.
   */

  const terminalLink = createUploadLink({
    uri: getApiLocation(), headers: {"keep-alive": "true"}, credentials: "include"
  });

  const authLink = new ApolloLink((operation, forward) => {
    const { cache } = operation.getContext();
    let token;
    try {
      const cacheValue = cache.readQuery({query: TOKEN});
      token = cacheValue.accessToken;
    } catch {
      token = null;
    }
    operation.setContext(({ headers }) => ({ headers: {
      authorization: token, ...headers
    }}));
    return forward(operation);
  });

  const link = ApolloLink.from([authLink, terminalLink]);

  const cache = new InMemoryCache({
    typePolicies: {
      GroupType: {fields: {
        users: {merge(existing, incoming) { return incoming } },
        admins: {merge(existing, incoming) { return incoming } },
        groupInvitations: {merge(existing, incoming) { return incoming } }
      }},
      UserType: {fields: {
        ownedCollections: {merge(existing, incoming) { return incoming } },
        groupInvitations: {merge(existing, incoming) { return incoming } },
        groups: {merge(existing, incoming) { return incoming } }
      }},
      CollectionType: {fields: {
        users: {merge(existing, incoming) { return incoming } },
        groups: {merge(existing, incoming) { return incoming } }
      }},
    }
  })

  return new ApolloClient({link: link, cache, credentials: "include"});
}
