import gql from "graphql-tag";

export const LOGIN = gql`mutation login($username: String! $password: String!) {
  login(username: $username password: $password) { accessToken }
}`;

export const REFRESH = gql`mutation { refreshToken { accessToken } }`;