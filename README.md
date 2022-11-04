# Api Gateway

**This mircroservice is responsible for :**

 - This microservice is an entry point for every request. It routes the request to other microservices.
 - It decypts the JWT token and add the user details into context so that other microservices can know the user details for incoming request.
 

### Installation

**1. Clone this repo by running the following command :-**
 ```bash
  git clone https://github.com/Ankush-0694/api_gateway
  cd api_gateway
 ```
 
 **2. Now install all the required packages by running the following commands :-**
 ```bash
  npm install 
 ```
 **3. Now start the node server by running the following command :-**
 ```bash
  node server.js
 ```
 **4.** **🎉  Open your browser and go to following url to run graphQL-Playground for testing GraphQL apis :-**
 ```bash
  http://localhost:4010/graphql
 ```
 
