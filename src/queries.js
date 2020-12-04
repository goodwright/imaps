import gql from "graphql-tag";

export const USER = gql`query user($username: String) {
  user(username: $username) { username email name groups { id name userCount } }
}`;

export const TOKEN = gql`{ accessToken }`;

export const GROUP = gql`query group($name: String!) {
  group(name: $name) { id name userCount }
}`;