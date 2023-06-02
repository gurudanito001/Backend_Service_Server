"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../dbConnection"));
const getAllClusters = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM clusters', (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const getClusterById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM clusters WHERE cluster_id = $1', [id], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const getClusterByParams = (whereString, valuesArray) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM clusters WHERE ${whereString}`, [...valuesArray], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const clusterExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM clusters WHERE cluster_id = $1)`, [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const valueExists = (table, column, value) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM ${table} WHERE ${column} = $1)`, [value], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const JsonbDataExists = (table, field, value) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM ${table} WHERE data->'${field}' = '"${value}"')`, (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const createCluster = (clusterData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, description, multi_tenant } = clusterData;
    const date = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('INSERT INTO clusters (name, email, password, description, multi_tenant, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, email, password, description, multi_tenant, date, date], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const updateCluster = (id, updateClusterData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, description, multi_tenant, verify_email_url, reset_password_url } = updateClusterData;
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE clusters SET name = $1, email = $2, password = $3, description = $4, multi_tenant = $5, verify_email_url = $6, reset_password_url = $7, updated_at = $8 WHERE cluster_id = $9 RETURNING *', [name, email, password, description, multi_tenant, verify_email_url, reset_password_url, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const updateClusterByParams = (setString, whereString, valuesArray) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`UPDATE clusters SET ${setString}  WHERE ${whereString} RETURNING *`, [...valuesArray], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const verifyEmail = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE clusters SET email_confirmed = $1, updated_at = $2 WHERE cluster_id = $3 AND email = $4 RETURNING *', [true, updated_at, id, email], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const deActivateCluster = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE clusters SET isActive = $1, updated_at = $2 WHERE cluster_id = $3 RETURNING *', [false, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const reActivateCluster = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE clusters SET isActive = $1, updated_at = $2 WHERE cluster_id = $3 RETURNING *', [true, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const deleteCluster = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('DELETE FROM clusters WHERE cluster_id = $1', [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(id);
        });
    });
});
exports.default = {
    getAllClusters,
    getClusterById,
    getClusterByParams,
    clusterExists,
    valueExists,
    JsonbDataExists,
    createCluster,
    updateCluster,
    updateClusterByParams,
    verifyEmail,
    deActivateCluster,
    reActivateCluster,
    deleteCluster,
};
//# sourceMappingURL=clusters.js.map