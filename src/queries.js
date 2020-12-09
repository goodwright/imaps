import gql from "graphql-tag";

export const USER_FIELDS = gql`
  fragment UserFields on UserType { 
    id username email name
    groups { id slug name userCount }
    adminGroups { id }
    groupInvitations { id group { id name slug } }
  }`;

export const USER = gql`query user($username: String) {
  user(username: $username) { 
    ...UserFields
  }
} ${USER_FIELDS}`;

export const TOKEN = gql`{ accessToken }`;

export const GROUP = gql`query group($slug: String!) {
  group(slug: $slug) {
    id slug name description userCount
    users { id name username } admins { id username }
    groupInvitations { id user { id username name } }
  }
  users { id username name }
}`;