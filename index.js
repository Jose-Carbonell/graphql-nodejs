// const { ApolloServer } = require("apollo-server");

// const typeDefs = require("./types");
// const resolvers = require("./resolvers");

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   playground: true,
// });

// server.listen().then(() => {
//   console.log(
//     "Corriendo aplicación graphQL en <http://localhost:4000/grapqhql>"
//   );
// });

const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const resolvers = require("./resolvers");
const typeDefs = require("./types");

(async function () {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
