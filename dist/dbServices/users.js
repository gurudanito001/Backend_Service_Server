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
const generateDataStructure_1 = __importDefault(require("../services/generateDataStructure"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM users', (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const getAllUsersByClusterId = (cluster_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM users WHERE cluster_id = $1', [cluster_id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const getUserByParams = (whereString, valuesArray) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM users WHERE ${whereString}`, [...valuesArray], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const getUserByJsonbData = (field, value) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM users WHERE data->'${field}' = '"${value}"'`, (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const userExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM users WHERE user_id = $1)`, [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { cluster_id, data } = userData;
    const date = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('INSERT INTO users (cluster_id, data, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [cluster_id, data, date, date], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE users SET data = $1, updated_at = $2 WHERE user_id = $3 RETURNING *', [data, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const verifyEmail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`UPDATE users SET email_confirmed = $1, updated_at = $2 WHERE user_id = $3 RETURNING *`, [true, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(id);
        });
    });
});
const createUserDataStructure = (cluster_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    let structure = (0, generateDataStructure_1.default)(data);
    const date = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('INSERT INTO user_data_structure (cluster_id, structure, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [cluster_id, structure, date, date], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const structureExists = (cluster_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM user_data_structure WHERE cluster_id = $1)`, [cluster_id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const getStructureByClusterId = (cluster_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM user_data_structure WHERE cluster_id = $1', [cluster_id], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const getAllStructures = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM user_data_structure', (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const deleteStructure = (cluster_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('DELETE FROM user_data_structure WHERE cluster_id = $1', [cluster_id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(cluster_id);
        });
    });
});
exports.default = {
    getAllUsers,
    getAllUsersByClusterId,
    getUserById,
    getUserByParams,
    getUserByJsonbData,
    userExists,
    createUser,
    updateUser,
    verifyEmail,
    deleteUser,
    createUserDataStructure,
    structureExists,
    getStructureByClusterId,
    getAllStructures,
    deleteStructure
};
//# sourceMappingURL=users.js.map