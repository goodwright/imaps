import gql from "graphql-tag";

export const LOGIN = gql`mutation login($username: String! $password: String!) {
  login(username: $username password: $password) { accessToken user {
    username email name
  } }
}`;

export const REFRESH = gql`mutation { refreshToken { accessToken user {
  username email name
} } }`;

export const LOGOUT = gql`mutation { logout { success } }`;

export const SIGNUP = gql`mutation login(
  $username: String! $password: String! $name: String! $email: String!
) { signup(
  username: $username password: $password name: $name email: $email
) { accessToken user { username email name } }
}`;