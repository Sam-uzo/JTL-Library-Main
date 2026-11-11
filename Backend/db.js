const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: "1sam*2uel",
  host: "localhost",
  port: "5432",
  database: "jtl_library",
});
module.exports = pool;
