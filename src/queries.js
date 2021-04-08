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
    collections { id name created owners { id username } groups { id slug } }
  }
} ${USER_FIELDS}`;

export const TOKEN = gql`{ accessToken }`;

export const GROUP = gql`query group($slug: String!) {
  group(slug: $slug) {
    id slug name description userCount
    users { id name username image } admins { id username }
    groupInvitations { id user { id username name } }
    collections { id name created owners { id username } }
  }
  users { id username name image }
  
}`;

export const COLLECTION = gql`query collection($id: ID!, $first: Int, $offset: Int) {
  collection(id: $id) {
    id name description created lastModified
    papers { id year title url } owners { id name username }
    sampleCount samples(first: $first offset: $offset) { edges { node {
      id name organism source piName annotatorName qcPass qcMessage
      created
    } } }
    executions { id name created started finished command {
      id name description
    } }
  }
}`;

export const PUBLIC_COLLECTIONS = gql`query publicCollections($offset: Int, $first: Int) {
  publicCollections(offset: $offset first: $first) { edges { node {
    id name created groups { id slug }
  } } }
  publicCollectionCount
}`;

export const USER_COLLECTIONS = gql`{ userCollections { 
  id name private created
  groups { id slug } owners { id }
} }`;

export const GROUP_COLLECTIONS = gql`query groupCollections($slug: String! $offset: Int $first: Int) {
  group(slug: $slug) { id name allCollectionsCount allCollections(first: $first offset: $offset) {
    edges { node { id name created private groups { id slug } } }
  } }
}`;

export const SAMPLE = gql`query sample($id: ID!) {
  sample(id: $id) {
    id name organism source piName annotatorName qcPass qcMessage
    created lastModified
    collection { id name }
    executions { id name created started finished command {
      id name description
    } }
  }
}`;

export const EXECUTION = gql`query execution($id: ID!) {
  execution(id: $id) {
    id name created scheduled started finished input output status
    warning error
    sample { id name }
    collection { id name }
    command { id name description inputSchema outputSchema }
    parent { id name }
    upstreamExecutions { id name output }
    downstreamExecutions { id started created finished name }
    componentExecutions { id name started created finished }
    owners { id name username }
  }
}`;