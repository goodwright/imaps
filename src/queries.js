import gql from "graphql-tag";

export const USER = gql`query user($username: String) {
  user(username: $username) { 
    username email name
    groups { id slug userCount }
    groupInvitations { id group { id name slug } }
  }
}`;

export const TOKEN = gql`{ accessToken }`;

export const GROUP = gql`query group($slug: String!) {
  group(slug: $slug) {
    id slug name description userCount
    users { id name username } admins { id username }
  }
  users { id username name }
}`;