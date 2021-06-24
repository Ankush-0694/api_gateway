const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const expressJwt = require("express-jwt");
require("dotenv").config();

const app = express();
const port = 4010;

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

const gateway = new ApolloGateway({
  serviceList: [
    { name: "products", url: "http://localhost:5000" },
    { name: "orders", url: "http://localhost:5001" },
    { name: "users", url: "http://127.0.0.1:4000/graphql" },
  ],

  /**
   * @param buildService this function add the user object to request header before sending request to the service
   */
  buildService({ name, url }) {
    // console.log(`${name} ,  ${url}`);
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set(
          "user",
          context.user ? JSON.stringify(context.user) : null
        );
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const user = req.user || null;
    // console.log(user);
    return { user };
  },
});

server.applyMiddleware({ app }); // add this into product and order , and update url into service

app.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});
