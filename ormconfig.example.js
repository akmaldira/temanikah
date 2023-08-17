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
    "./dist/database/entities/*.entity.js",
    "./src/database/entities/*.entity.ts",
  ],
  migrations: ["./migrations/*.js"],
  migrationsTableName: "migrations",
};
