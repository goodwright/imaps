export const createErrorObject = (errors, graphQLErrors) => {
  /**
   * Takes an object representing error messages, and a GraphQL error object,
   * and populates the relevant values in the error object against the fields in
   * the GraphQL error object.
   * 
   * If the GraphQL error object can't be parsed, a general error message will
   * be added.
   * 
   * Requires that the error object have the correct key names to start with.
   */

  const errorObj = Object.keys(errors).reduce(
    (o, key) => Object.assign(o, {[key]: ""}), {}
  );
  try {
    const message = JSON.parse(graphQLErrors[0].message);
    for (let field of Object.keys(message)) {
      errorObj[field] = message[field][0];
    }
  } catch {
    errorObj.general = "An error occured."; 
  }
  return errorObj;
}