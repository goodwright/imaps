import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { TOKEN } from "./queries";

export const makeClient = () => {
  /**
   * Creates an apollo client with automatic token insertion, and catchall
   * error handling.
   */

  const terminalLink = createUploadLink({
    uri: `${process.env.REACT_APP_BACKEND}/graphql`,
    headers: {"keep-alive": "true"}, credentials: "include"
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
