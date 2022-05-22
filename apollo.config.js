module.exports = {
  client: {
    service: {
      name: "vote-client",
      // URL to the GraphQL API
      url: process.env.VUE_APP_GRAPHQL_ENDPOINT || "http://127.0.0.1:8000/graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
