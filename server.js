const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/apiGateway", (req, res) => {
  res.send("api_gateway service in your service");
});

app.listen(4010, () => {
  console.log("server listening to port 4010");
});
