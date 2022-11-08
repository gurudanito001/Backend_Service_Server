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
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM users', (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
};
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
const getUserByParams = (whereString, paramsObject) => __awaiter(void 0, void 0, void 0, function* () {
    const values = Object.values(paramsObject);
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM users WHERE ${whereString}`, [...values], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const userExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM users WHERE user_id = $1`, [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const createUser = (userData) => {
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
};
const updateUser = (id, data) => {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE users SET data = $1, updated_at = $2 WHERE user_id = $3 RETURNING *', [data, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
};
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(id);
        });
    });
};
exports.default = {
    getAllUsers,
    getUserById,
    getUserByParams,
    userExists,
    createUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=users.js.map