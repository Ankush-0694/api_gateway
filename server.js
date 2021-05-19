// const express = require("express");
// const app = express();
// const cors = require("cors");

// app.use(cors());

// app.get("/apiGateway", (req, res) => {
//   res.send("api_gateway service in your service");
// });

// app.listen(4010, () => {
//   console.log("server listening to port 4010");
// });

const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const port = 4010;

const gateway = new ApolloGateway({
  serviceList: [
    { name: "product", url: "http://localhost:4001/graphql" },
    // { name: "order", url: "http://localhost:4002" },
  ],
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

server.listen({ port }).then(({ url }) => {
  console.log(`Apollo Server ready at url${url}`);
});
