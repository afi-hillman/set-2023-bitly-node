// import config from "../config";

// // const { Pool } = require("pg");

// // const pool = new Pool({
// //   user: config.postgres.user,
// //   host: config.postgres.host,
// //   database: config.postgres.database,
// //   password: config.postgres.password,
// //   port: config.postgres.port,
// // });

// async function query(text, values) {
//   const start = Date.now();
//   const res = await pool.query(text, values);
//   const duration = Date.now() - start;
//   console.log("executed query", { text, duration, rows: res.rowCount });
//   return res;
// }

// export default query;
