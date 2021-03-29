module.exports = {
  // Allows us to use the Apollo GraphQL extension so that VSCode has awareness of our schema
  client: {
    service: {
      url: "http://localhost:4000/graphql",
      // local copy can be downloaded using localSchemaFile and provide the local path to that file
      skipSSLValidation: true,
    }
  }
}