"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../../dbConnection"));
const getUsers = (request, response) => {
    dbConnection_1.default.query('SELECT * FROM users', (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).json(results.rows);
    });
};
const getUserById = (request, response) => {
    const user_id = request.params.id;
    dbConnection_1.default.query('SELECT * FROM users WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).json(results.rows[0]);
    });
};
const createUser = (request, response) => {
    const { cluster_id, data } = request.body;
    dbConnection_1.default.query('INSERT INTO users (cluster_id, data) VALUES ($1, $2) RETURNING cluster_id, user_id, data', [cluster_id, data], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).send(results.rows[0]);
    });
};
const updateUser = (request, response) => {
    const id = request.params.id;
    const { data } = request.body;
    dbConnection_1.default.query('UPDATE users SET data = $1 WHERE user_id = $2 RETURNING user_id, cluster_id, data', [data, id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).send(results.rows[0]);
    });
};
const deleteUser = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};
exports.default = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=users.js.map