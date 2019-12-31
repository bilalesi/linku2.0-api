const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql(
  fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")
);

const server = new ApolloServer({
  typeDefs
});

module.exports = server;
