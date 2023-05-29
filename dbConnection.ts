import config from './config'
const Pool = require('pg').Pool

let enviroment = config.ENVIRONMENT
let dbUrl: string ;
if(enviroment === "prod"){
  dbUrl = config.DATABASE_URL
}else{
  dbUrl = config.LOCAL_DATABASE_URL
}

/* const pool = new Pool({
  user: config.LOCAL_DB_USER,
  host: config.LOCAL_DB_HOST,
  database: config.LOCAL_DATABASE,
  password: config.LOCAL_PASSWORD,
  port: config.LOCAL_DB_PORT
}) */

const pool = new Pool({
  connectionString: dbUrl + "?sslmode=require",
})

export default pool;