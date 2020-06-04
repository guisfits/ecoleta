import path from "path";

module.exports = {
  client: "pg",
  connection: {
    host: "localhost",
    database: "ecoleta-db",
    user: "server",
    password: "rocketseat",
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
};
