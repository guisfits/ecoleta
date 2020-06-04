import knex from "knex";

const connection = knex({
  client: "pg",
  connection: {
    host: "localhost",
    database: "ecoleta-db",
    user: "server",
    password: "rocketseat",
  },
});

export default connection;
