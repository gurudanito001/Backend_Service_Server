const Pool = require('pg').Pool

const pool = new Pool({
  user: 'daniel',
  host: 'localhost',
  database: 'backend_service',
  password: 'fsWxKmrDfufmqESvC3TH',
  port: 5433
})

export default pool;