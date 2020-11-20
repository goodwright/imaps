import gql from "graphql-tag";

export const USER = gql`{
  user { username email name }
}`;