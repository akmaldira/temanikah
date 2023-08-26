const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "postgres",
  synchronize: false,
  logging: false,
  entities: [
    NODE_ENV === "production"
      ? "./dist/database/**/*.entity.js"
      : "./src/database/**/*.entity.ts",
  ],
  migrations: ["./migrations/*.js"],
  migrationsTableName: "migrations",
};
