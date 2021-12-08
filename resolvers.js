const tasks = [];

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
module.exports = {
  Query: {
    tasks: () => tasks,
    task: (parent, args, context) => {
      const task = tasks.find((task) => task.id === args.id);
      return task;
    },
  },
  Mutation: {
    addTask: (parent, args, context) => {
      const { name } = args.input;
      const newTask = {
        id: Math.floor(100000 + Math.random() * 900000),
        name: name,
      };

      tasks.push(newTask);
      pubsub.publish("TASK_CREATED", {
        taskAdded: newTask,
      });
      return newTask;
    },
  },
  Subscription: {
    taskAdded: {
      // More on pubsub below
      subscribe: (args) => {
        return pubsub.asyncIterator(["TASK_CREATED"]);
      },
    },
  },
};
