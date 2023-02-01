import config from './config'
const Pool = require('pg').Pool

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_LOCALHOST,
  database: config.DATABASE,
  password: config.PASSWORD,
  port: config.DB_LOCAL_PORT
})

export default pool;