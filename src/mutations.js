import gql from "graphql-tag";

export const LOGIN = gql`mutation login($username: String! $password: String!) {
  login(username: $username password: $password) { accessToken user {
    username email name groups { id name }
  } }
}`;

export const LOGOUT = gql`mutation { logout { success } }`;

export const SIGNUP = gql`mutation login(
  $username: String! $password: String! $name: String! $email: String!
) { signup(
  username: $username password: $password name: $name email: $email
) { accessToken user { username email name groups { id name } } }
}`;

export const UPDATE_USER = gql`mutation updateUser(
  $username: String! $email: String! $name: String!
) { updateUser(username: $username email: $email name: $name) {
  user { username name email groups { id name } }
} }`;

export const UPDATE_PASSWORD = gql`mutation updateUser(
  $new: String! $current: String!
) { updatePassword(new: $new current: $current) {
  success
} }`;

export const DELETE_USER = gql`mutation { deleteUser { success } }`;