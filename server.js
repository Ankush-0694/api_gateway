const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const expressJwt = require("express-jwt");

const FileUploadDataSource = require("@profusion/apollo-federation-upload");

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
    { name: "products", url: "http://localhost:4001/graphql" },
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
  // buildService: ({ url }) => {
  //   return new FileUploadDataSource({ url, useChunkedTransfer: false });
  // },
});

const apolloServer = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const user = req.user || null;
    // console.log(user);
    return { user };
  },
});

async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  await app.listen({ port: 4010 });

  console.log(
    `🚀 Gateway Server ready at http://localhost:4010${apolloServer.graphqlPath}`
  );
}

startServer();
