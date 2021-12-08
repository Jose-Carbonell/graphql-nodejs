const { gql } = require("apollo-server");

const types = gql`
  input TaskInput {
    name: String!
  }

  type Task {
    id: Int!
    name: String!
  }

  type Query {
    tasks: [Task]!
    task(id: Int!): Task
  }

  type Mutation {
    addTask(input: TaskInput): Task
  }

  type Subscription {
    taskAdded: Task
  }
`;

module.exports = types;
