const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const expressJwt = require("express-jwt");
const cors = require("cors");

const FileUploadDataSource = require("@profusion/apollo-federation-upload");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

const gateway = new ApolloGateway({
  serviceList: [
    { name: "users", url: "http://127.0.0.1:4000/graphql" },
    { name: "products", url: "http://localhost:4001/graphql" },
    { name: "orders", url: "http://localhost:4002/graphql" },
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

const port = process.env.PORT || 4010;

async function startServer() {
  try {
    await apolloServer.start();
  } catch (error) {
    console.log(error);
  }

  apolloServer.applyMiddleware({ app });

  await app.listen({ port: port });

  console.log(
    `🚀 Gateway Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
}

startServer();
