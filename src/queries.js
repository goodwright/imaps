import gql from "graphql-tag";

export const USER = gql`query user($username: String) {
  user(username: $username) { username email name groups { id name userCount } }
}`;

export const TOKEN = gql`{ accessToken }`;