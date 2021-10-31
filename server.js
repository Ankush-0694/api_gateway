const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const expressJwt = require("express-jwt");
const cors = require("cors");
// const FileUploadDataSource = require("@profusion/apollo-federation-upload");
require("dotenv").config();

async function startServer() {
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

  await apolloServer.start();

  //   // Additional middleware can be mounted at this point to run before Apollo.
  //  example -  app.use("*", jwtCheck, requireAuth, checkScope);

  const port = process.env.PORT || 4010;

  // Mount Apollo middleware here.
  apolloServer.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: port }, resolve));

  console.log(
    `🚀 Gateway Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
  return { apolloServer, app };
}

startServer();
