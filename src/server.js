const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");

const Query = require("./resolvers/queries");

const typeDefs = gql(
  fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")
);

const resolvers = {
  Query
};

const server = new ApolloServer({
  resolvers,
  typeDefs
});

module.exports = server;
