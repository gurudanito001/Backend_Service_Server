"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../dbConnection"));
const getCollections = (request, response) => {
    dbConnection_1.default.query('SELECT * FROM collections', (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).json(results.rows);
    });
};
const getCollectionById = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('SELECT * FROM collections WHERE collection_id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).json(results.rows);
    });
};
const createCollection = (request, response) => {
    const { cluster_id, user_id, name } = request.body;
    dbConnection_1.default.query('INSERT INTO collections (cluster_id, user_id, name) VALUES ($1, $2, $3)', [cluster_id, user_id, name], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).send(`New Collection Created`);
    });
};
const updateCollection = (request, response) => {
    const id = request.params.id;
    const { cluster_id, user_id, name } = request.body;
    dbConnection_1.default.query('UPDATE collections SET name = $1 WHERE collection_id = $2', [name, id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Collection modified with ID: ${id}`);
    });
};
const deleteCollection = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('DELETE FROM collections WHERE collection_id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Collection deleted with ID: ${id}`);
    });
};
exports.default = {
    getCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
};
//# sourceMappingURL=collections.js.map