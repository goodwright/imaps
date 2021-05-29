import gql from "graphql-tag";
import { USER_FIELDS } from "./queries";

export const LOGIN = gql`mutation login($username: String! $password: String!) {
  login(username: $username password: $password) { accessToken user {
    ...UserFields
  } }
} ${USER_FIELDS}`;

export const LOGOUT = gql`mutation { logout { success } }`;

export const SIGNUP = gql`mutation login(
  $username: String! $password: String! $name: String! $email: String!
) { signup(
  username: $username password: $password name: $name email: $email
) { accessToken user { 
  ...UserFields
 } }
} ${USER_FIELDS}`;

export const UPDATE_USER = gql`mutation updateUser(
  $username: String! $email: String! $name: String!
) { updateUser(username: $username email: $email name: $name) {
  user { 
    ...UserFields
   }
} } ${USER_FIELDS}`;

export const UPDATE_PASSWORD = gql`mutation updateUser(
  $new: String! $current: String!
) { updatePassword(new: $new current: $current) {
  success
} }`;

export const REQUEST_PASSWORD_RESET = gql`mutation requestReset(
  $email: String!
) { requestPasswordReset(email: $email) { success } }`;

export const RESET_PASSWORD = gql`mutation resetPassword(
  $token: String! $password: String!
) { resetPassword(token: $token password: $password) { success } }`;

export const UPDATE_USER_IMAGE = gql`mutation updateImage($image: Upload!) {
  updateUserImage(image: $image) { user { ...UserFields } }
} ${USER_FIELDS}`;

export const DELETE_USER = gql`mutation { deleteUser { success } }`;


export const CREATE_GROUP = gql`mutation createGroup(
  $name: String! $slug: String! $description: String!
) { createGroup(name: $name slug: $slug description: $description) {
  group { id name slug description }
  user { 
    ...UserFields
   } 
} } ${USER_FIELDS}`;

export const UPDATE_GROUP = gql`mutation updateGroup(
  $id: ID! $name: String! $slug: String! $description: String!
) { updateGroup(id: $id name: $name slug: $slug description: $description) {
  group { id name slug description }
  user { 
    ...UserFields
   } 
} } ${USER_FIELDS}`;

export const DELETE_GROUP = gql`mutation deleteGroup($id: ID!) { deleteGroup(id: $id) {
  success user { 
    ...UserFields
   }
} } ${USER_FIELDS}`;

export const INVITE_TO_GROUP = gql`mutation inviteToGroup($group: ID! $user: ID!) {
  inviteUserToGroup(user: $user group: $group) {
    group { id } user { id }
  }
}`;

export const DECLINE_INVITATION = gql`mutation processGroupInvitation($user: ID! $group: ID!) {
  processGroupInvitation(user: $user group: $group accept: false) {
    success
    user { 
      ...UserFields
    }
  }
} ${USER_FIELDS}`;

export const ACCEPT_INVITATION = gql`mutation processGroupInvitation($user: ID! $group: ID!) {
  processGroupInvitation(user: $user group: $group accept: true) {
    success
    user { 
      ...UserFields
    }
  }
} ${USER_FIELDS}`;

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

export const LEAVE_GROUP = gql`mutation leaveGroup($id: ID!) {
  leaveGroup(id: $id) { user {
    ...UserFields
  } }
} ${USER_FIELDS}`;

export const REMOVE_USER = gql`mutation removeUser($group: ID! $user: ID!) {
  removeUserFromGroup(group: $group user: $user) {
    group { id }
  }
}`;


export const CREATE_COLLECTION = gql`mutation createCollection(
  $name: String! $description: String! $private: Boolean!
) { createCollection(name: $name description: $description private: $private) {
  collection { id }
} }`;

export const UPDATE_COLLECTION = gql`mutation updateCollection(
  $id: ID! $name: String! $description: String! $private: Boolean! $papers: [PaperInput],
) { updateCollection(id: $id name: $name description: $description private: $private papers: $papers) {
  collection { id }
} }`;

export const UPDATE_COLLECTION_ACCESS = gql`mutation updateCollectionAccess(
  $id: ID! $user: ID $group: ID $permission: Int!
) { updateCollectionAccess(id: $id user: $user group: $group permission: $permission) {
  collection { id }
} }`;

export const DELETE_COLLECTION = gql`mutation deleteCollection($id: ID!) {
  deleteCollection(id: $id) { success }
}`;

export const UPDATE_SAMPLE = gql`mutation updateSample(
  $id: ID! $name: String! $collection: ID! $annotatorName: String! $piName: String! $organism: String! $source: String!
) { updateSample(id: $id name: $name collection: $collection annotatorName: $annotatorName piName: $piName organism: $organism source: $source) {
  sample { id }
} }`;

export const UPDATE_SAMPLE_ACCESS = gql`mutation updateSampleAccess(
  $id: ID! $user: ID $permission: Int!
) { updateSampleAccess(id: $id user: $user permission: $permission) {
  sample { id }
} }`;

export const DELETE_SAMPLE = gql`mutation deleteSample($id: ID!) {
  deleteSample(id: $id) { success }
}`;

export const UPDATE_EXECUTION = gql`mutation updateExecution(
  $id: ID! $name: String!
) { updateExecution(id: $id name: $name ) {
  execution { id }
} }`;

export const UPDATE_EXECUTION_ACCESS = gql`mutation updateExecutionAccess(
  $id: ID! $user: ID $permission: Int!
) { updateExecutionAccess(id: $id user: $user permission: $permission) {
  execution { id }
} }`;

export const DELETE_EXECUTION = gql`mutation deleteExecution($id: ID!) {
  deleteExecution(id: $id) { success }
}`;

export const RUN_COMMAND = gql`mutation runCommand(
  $command: ID! $inputs: String! $collection: ID $uploads: [Upload]
) {
  runCommand(command: $command inputs: $inputs uploads: $uploads collection: $collection) {
    execution { id }
  }
}`;