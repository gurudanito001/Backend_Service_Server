import config from './config'
const Pool = require('pg').Pool

/* const pool = new Pool({
  user: config.LOCAL_DB_USER,
  host: config.LOCAL_DB_HOST,
  database: config.LOCAL_DATABASE,
  password: config.LOCAL_PASSWORD,
  port: config.LOCAL_DB_PORT
}) */

const pool = new Pool({
  connectionString: config.DATABASE_URL + "?sslmode=require",
})

export default pool;