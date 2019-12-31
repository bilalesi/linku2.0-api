const fs = require('fs');
const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const database = require('./services/database');
const models = require('./models');

database.connect();

const Query = require('./resolvers/queries');
const Mutation = require('./resolvers/mutations');

const typeDefs = gql(
  fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8'),
);


const customScalarTypes = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

const resolvers = {
  Query,
  Mutation,
  customScalarTypes,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    authToken: req.headers['x-access-token'] || req.headers.authorization,
    models,
    res,
  }),
  playground: true,
});

module.exports = server;
