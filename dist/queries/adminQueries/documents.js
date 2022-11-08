"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../../dbConnection"));
const getDocuments = (request, response) => {
    dbConnection_1.default.query('SELECT * FROM documents', (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).json(results.rows);
    });
};
const getDocumentById = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('SELECT * FROM documents WHERE document_id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).json(results.rows[0]);
    });
};
const createDocument = (request, response) => {
    const { cluster_id, collection_id, user_id, data } = request.body;
    const date = Date.now().toString();
    dbConnection_1.default.query('INSERT INTO documents (cluster_id, collection_id, user_id, data, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)', [cluster_id, collection_id, user_id, data, date, date], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).send(`New Document Created`);
    });
};
const updateDocument = (request, response) => {
    const id = request.params.id;
    const { data } = request.body;
    const date = Date.now().toString();
    dbConnection_1.default.query('UPDATE documents SET data = $1, updated_at = $2 WHERE document_id = $3', [data, date, id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Document modified with ID: ${id}`);
    });
};
const deleteDocument = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('DELETE FROM documents WHERE document_id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Document deleted with ID: ${id}`);
    });
};
exports.default = {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
};
//# sourceMappingURL=documents.js.map