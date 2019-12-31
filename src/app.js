const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const { UI } = require('bull-board');

const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const models = require('./models');

const database = require('./services/database');
database.connect();

const config = require('./config');
const { origin } = config.server;

const app = express();

app.use(
  cors({
    origin
  })
);

const Query = require('./resolvers/queries');
const Mutation = require('./resolvers/mutations');

const typeDefs = gql(
  fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')
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
    }
  })
};

const resolvers = {
  Query,
  Mutation,
  ...customScalarTypes
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ res }) => ({
    models,
    res
  }),
  playground: true
});

server.applyMiddleware({ app });

app.use('/queues', UI);

module.exports = app;
