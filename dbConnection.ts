const Pool = require('pg').Pool

const pool = new Pool({
  user: 'daniel',
  host: 'backend-service.csgkjnrffsg6.us-east-1.rds.amazonaws.com',
  database: 'backend_service',
  password: 'fsWxKmrDfufmqESvC3TH',
  port: 5432
})

export default pool;