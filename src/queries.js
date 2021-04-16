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
    collections { 
      id name created sampleCount executionCount
      owners { id username } groups { id slug }
    }
  }
} ${USER_FIELDS}`;

export const TOKEN = gql`{ accessToken }`;

export const QUICK_SEARCH = gql`query quickSearch($query: String!) {
  quickSearch(query: $query) { results {
    name pk kind match matchLoc
  }}
}`;

export const GROUP = gql`query group($slug: String!) {
  group(slug: $slug) {
    id slug name description userCount
    users { id name username image } admins { id username }
    groupInvitations { id user { id username name } }
    collections { id name created sampleCount executionCount owners { id username } }
  }
  users { id username name image }
  
}`;

export const COLLECTION = gql`query collection($id: ID!) {
  collection(id: $id) {
    id name description created lastModified
    papers { id year title url } owners { id name username }
    samples {
      id name organism source piName annotatorName qcPass qcMessage
      created
    }
    executions { id name created started finished command {
      id name description
    } }
  }
}`;

export const PUBLIC_COLLECTIONS = gql`query publicCollections($offset: Int, $first: Int) {
  publicCollections(offset: $offset first: $first) { edges { node {
    id name created sampleCount executionCount owners { id username }
  } } }
  publicCollectionCount
}`;

export const USER_COLLECTIONS = gql`{ userCollections { 
  id name private created
  groups { id slug } owners { id }
} }`;

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

export const SEARCH_COLLECTIONS = gql`query searchCollections(
  $query: String! $sort: String $owner: String $created: String
) {
  searchCollections(
    query: $query sort: $sort owner: $owner created: $created
  ) {
    id name created owners { id name }
  }
}`;

export const SEARCH_SAMPLES = gql`query searchSamples(
  $query: String! $sort: String $ organism: String $owner: String $created: String
) {
  searchSamples(
    query: $query sort: $sort organism: $organism owner: $owner created: $created
  ) {
    id name organism created collection { id owners { id name } }
  }
}`;

export const SEARCH_EXECUTIONS = gql`query searchExecutions(
  $query: String! $sort: String $command: String $owner: String $created: String
) {
  searchExecutions(
    query: $query sort: $sort command: $command owner: $owner created: $created
  ) {
    id name created command { id name } 
    collection { id owners { id name } }
    sample { id collection { id owners { id name } } }
  }
}`;