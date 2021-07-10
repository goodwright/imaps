import gql from "graphql-tag";

export const USER_FIELDS = gql`
  fragment UserFields on UserType { 
    id username email name image
    memberships { id slug name userCount }
    adminGroups { id }
    invitations { id name slug }
  }`;

export const USER = gql`query user($username: String) {
  user(username: $username) { 
    ...UserFields
    publicCollections { 
      id name created sampleCount executionCount
      owners { id username }
    }
  }
} ${USER_FIELDS}`;

export const PUBLIC_USER = gql`query user($username: String) {
  user(username: $username) { 
    ...UserFields
    publicCollections { 
      id name created sampleCount executionCount
      owners { id username }
    }
    uploads {
      id name created command { id outputType }
    }
  }
} ${USER_FIELDS}`;

export const TOKEN = gql`{ accessToken }`;

export const QUICK_SEARCH = gql`query quickSearch($query: String!) {
  quickSearch(query: $query) {
    collections { id name description created }
    samples { id name organism created }
    executions { id name created }
    groups { id name description slug }
    users { id name username }
  }
}`;

export const GROUP = gql`query group($slug: String!) {
  group(slug: $slug) {
    id slug name description userCount
    members { id name username image } admins { id username }
    invitees { id username name }
    publicCollections { id name created sampleCount executionCount owners { id username } }
  }
  users { id username name image }
}`;

export const COLLECTION = gql`query collection($id: ID!) {
  collection(id: $id) {
    id name description created lastModified private canEdit canShare isOwner
    papers { id year title url } owners { id name username }
    samples {
      id name organism source piName annotatorName qcPass qcMessage
      created
    }
    executions { id name created started finished input command {
      id name outputType category
    } }
    users { id name username collectionPermission(id: $id) }
    groups { id slug collectionPermission(id: $id) }
  }
  users { id name username }
  groups { id slug }
}`;

export const COLLECTION_DATA = gql`query collection($id: ID!) {
  collection(id: $id) {
    id executions { id name created started finished input owners { id name } command {
      id name description outputType
    } }
  }
}`;

export const PUBLIC_COLLECTIONS = gql`query publicCollections($first: Int $last: Int) {
  publicCollections(first: $first last: $last) { count edges { node {
    id name created sampleCount executionCount owners { id username }
  } } }
}`;

export const USER_COLLECTIONS = gql`{
  userCollections { 
    id name private created
    groups { id slug } owners { id }
  }
  user { id collections { 
    id name private created owners { id }
   } }
}`;

export const SAMPLE = gql`query sample($id: ID!) {
  sample(id: $id) {
    id name organism source piName annotatorName qcPass qcMessage
    created lastModified canEdit canShare isOwner
    collection { id name }
    executions { id name created started finished input owners { id name } command {
      id name description outputType
    } }
    users { id name username samplePermission(id: $id) }
  }
  user { id ownedCollections { id name } }
  users { id name username }
}`;

export const EXECUTION = gql`query execution($id: ID!) {
  execution(id: $id) {
    id name
    created lastModified started finished status warning error
    input output
    command { id name description category outputType }
    demultiplexExecution { id name }
    demultiplexed { id name created command { id name outputType } }
    upstream { id name command { name } }
    downstream { id name created command { id name outputType } }
    parent { id name command { name } }
    children { id name created command { id name outputType } }
    sample { id name } collection { id name }
    owners { id name }
  }
  users { id name username }
}`;

export const COMMANDS = gql`{
  commands { id name category outputType slug }
  user { ownedCollections { id name } }
}`;

export const COMMAND = gql`query command($id: ID!) {
  command(id: $id) {
    id name description category outputType
  }
}`;

export const POSSIBLE_EXECUTIONS = gql`query possibleExecutions($dataType: String $first: Int $last: Int $collection: ID) {
  executions(dataType: $dataType first: $first last: $last collection: $collection) { count edges { node {
    id name created started finished input owners { id name } command {
      id name description outputType
    }
  } } }
}`;

export const SEARCH_COLLECTIONS = gql`query searchCollections(
  $query: String! $sort: String $owner: String $created: String $first: Int $last: Int
) {
  searchCollections(
    query: $query sort: $sort owner: $owner created: $created first: $first last: $last
  ) { count edges { node {
    id name created owners { id name }
  } }
  }
}`;

export const SEARCH_SAMPLES = gql`query searchSamples(
  $query: String! $sort: String $ organism: String $owner: String $created: String $first: Int $last: Int
) {
  searchSamples(
    query: $query sort: $sort organism: $organism owner: $owner created: $created
    first: $first last: $last
  ) { count edges { node {
    id name organism created collection { id owners { id name } }
  } } }
}`;

export const SEARCH_EXECUTIONS = gql`query searchExecutions(
  $query: String! $sort: String $command: String $owner: String $created: String $first: Int $last: Int
) {
  searchExecutions(
    query: $query sort: $sort command: $command owner: $owner created: $created
    first: $first last: $last
  ) { count edges { node {
    id name created command { id name } 
    collection { id owners { id name } }
    sample { id collection { id owners { id name } } }
  } } }
}`;