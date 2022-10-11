"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'daniel',
    host: 'localhost',
    database: 'backend_service',
    password: 'fsWxKmrDfufmqESvC3TH',
    port: 5433
});
exports.default = pool;
//# sourceMappingURL=dbConnection.js.map