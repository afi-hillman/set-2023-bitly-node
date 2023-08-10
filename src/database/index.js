const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bitly-node",
  password: "5050",
  port: 5432,
});

async function query(text, values) {
  const start = Date.now();
  const res = await pool.query(text, values);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
}

export default query;
