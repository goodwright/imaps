import gql from "graphql-tag";

export const USER_FIELDS = gql`
  fragment UserFields on UserType { 
    id username email name image
    groups { id slug name userCount }
    adminGroups { id }
    groupInvitations { id group { id name slug } }
  }`;

export const USER = gql`query user($username: String) {
  user(username: $username) { 
    ...UserFields
    ownedCollections { id name creationTime owner { name } groups { id slug } }
  }
} ${USER_FIELDS}`;

export const TOKEN = gql`{ accessToken }`;

export const GROUP = gql`query group($slug: String!) {
  group(slug: $slug) {
    id slug name description userCount
    users { id name username image } admins { id username }
    groupInvitations { id user { id username name } }
    collections { id name creationTime owner { name } groups { id slug } }
  }
  users { id username name image }
  
}`;

export const COLLECTION = gql`query collection($id: ID!, $first: Int, $offset: Int) {
  collection(id: $id) {
    id name description creationTime lastModified
    papers { id year title url } owner { id username name }
    sampleCount samples(first: $first offset: $offset) { edges { node {
      id name organism source piName annotatorName qcPass qcMessage
      creationTime
    } } }
    executions { id name created started finished process {
      id name description
    } }
  }
}`;

export const COLLECTIONS = gql`query collections($offset: Int, $first: Int) {
  collections(offset: $offset first: $first) { edges { node {
    id name creationTime owner { id name } groups { id slug }
  } } }
  collectionCount
}`;

export const USER_COLLECTIONS = gql`{ user {
  ownedCollections { id name creationTime private owner { name } groups { id slug } }
  collections { id name creationTime private owner { name } groups { id name slug } users { id } } 
} }`;

export const GROUP_COLLECTIONS = gql`query groupCollections($slug: String! $offset: Int $first: Int) {
  group(slug: $slug) { id name allCollectionsCount allCollections(first: $first offset: $offset) {
    edges { node { id name creationTime private owner { name } groups { id slug } } }
  } }
}`;

export const SAMPLE = gql`query sample($id: ID!) {
  sample(id: $id) {
    id name organism source piName annotatorName qcPass qcMessage
    creationTime lastModified
    collection { id name }
    executions { id name created started finished process {
      id name description
    } }
  }
}`;

export const EXECUTION = gql`query execution($id: ID!) {
  execution(id: $id) {
    id name created scheduled started finished input output legacyId
    sample { id name }
    collection { id name }
    process { id name description inputSchema outputSchema }
  }
}`;