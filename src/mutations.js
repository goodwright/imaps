import gql from "graphql-tag";

export const LOGIN = gql`mutation login($username: String! $password: String!) {
  login(username: $username password: $password) { accessToken user {
    id username email name
    groups { id slug userCount }
    groupInvitations { id group { id name slug } }
  } }
}`;

export const LOGOUT = gql`mutation { logout { success } }`;

export const SIGNUP = gql`mutation login(
  $username: String! $password: String! $name: String! $email: String!
) { signup(
  username: $username password: $password name: $name email: $email
) { accessToken user { 
  id username email name
  groups { id slug userCount }
  groupInvitations { id group { id name slug } }
 } }
}`;

export const UPDATE_USER = gql`mutation updateUser(
  $username: String! $email: String! $name: String!
) { updateUser(username: $username email: $email name: $name) {
  user { 
    id username email name
    groups { id slug userCount }
    groupInvitations { id group { id name slug } }
   }
} }`;

export const UPDATE_PASSWORD = gql`mutation updateUser(
  $new: String! $current: String!
) { updatePassword(new: $new current: $current) {
  success
} }`;

export const DELETE_USER = gql`mutation { deleteUser { success } }`;


export const CREATE_GROUP = gql`mutation createGroup(
  $name: String! $slug: String! $description: String!
) { createGroup(name: $name slug: $slug description: $description) {
  group { id name slug description }
  user { 
    id username email name
    groups { id slug userCount }
    groupInvitations { id group { id name slug } }
   } 
} }`;

export const UPDATE_GROUP = gql`mutation updateGroup(
  $id: ID! $name: String! $slug: String! $description: String!
) { updateGroup(id: $id name: $name slug: $slug description: $description) {
  group { id name slug description }
  user { 
    id username email name
    groups { id slug userCount }
    groupInvitations { id group { id name slug } }
   } 
} }`;

export const DELETE_GROUP = gql`mutation deleteGroup($id: ID!) { deleteGroup(id: $id) {
  success user { 
    id username email name
    groups { id slug userCount }
    groupInvitations { id group { id name slug } }
   }
} }`;

export const INVITE_TO_GROUP = gql`mutation inviteToGroup($group: ID! $user: ID!) {
  inviteUserToGroup(user: $user group: $group) {
    invitation { id }
  }
}`;

export const DECLINE_INVITATION = gql`mutation declineInvitation($id: ID!) {
  deleteGroupInvitation(id: $id) {
    success
    user { 
      id username email name
      groups { id slug userCount }
      groupInvitations { id group { id name slug } }
    }
  }
}`;

export const ACCEPT_INVITATION = gql`mutation acceptInvitation($id: ID!) {
  acceptGroupInvitation(id: $id) {
    group { id slug name }
    user { 
      id username email name
      groups { id slug userCount }
      groupInvitations { id group { id name slug } }
    }
  }
}`;

export const MAKE_ADMIN = gql`mutation makeAdmin($group: ID! $user: ID!) {
  makeGroupAdmin(group: $group user: $user) {
    group { id }
  }
}`;

export const REVOKE_ADMIN = gql`mutation makeAdmin($group: ID! $user: ID!) {
  revokeGroupAdmin(group: $group user: $user) {
    user { id }
  }
}`;