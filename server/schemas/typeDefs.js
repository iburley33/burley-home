const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    username: String!
    email: String!
    password: String!
    savedRestaurants: [Restaurant]
  }

  type Restaurant {
    name: String!
    address: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user: User
    restaurant: [Restaurant]
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
    addFavorite(user: [ID]!): Restaurant
    updateUser(
      firstName: String
      lastName: String
      email: String
      password: String
    ): User
    login(username: String!, email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
