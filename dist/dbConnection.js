"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const Pool = require('pg').Pool;
let enviroment = config_1.default.ENVIRONMENT;
let dbUrl;
if (enviroment === "prod") {
    dbUrl = config_1.default.DATABASE_URL;
}
else {
    dbUrl = config_1.default.LOCAL_DATABASE_URL;
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
});
exports.default = pool;
//# sourceMappingURL=dbConnection.js.map