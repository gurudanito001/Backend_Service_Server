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
const getAllDocuments = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM documents', (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const getDocumentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM documents WHERE document_id = $1', [id], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const getOneDocumentByParams = (whereString, paramsObject) => __awaiter(void 0, void 0, void 0, function* () {
    const values = Object.values(paramsObject);
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM documents WHERE ${whereString}`, [...values], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const getAllDocumentsByParams = (whereString, paramsObject) => __awaiter(void 0, void 0, void 0, function* () {
    const values = Object.values(paramsObject);
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM documents WHERE ${whereString}`, [...values], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const documentExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM documents WHERE document_id = $1)`, [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const createDocument = (documentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { cluster_id, collection_id, user_id, collection_name, data } = documentData;
    const date = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('INSERT INTO documents (cluster_id, collection_id, user_id, data, collection_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [cluster_id, collection_id, user_id, data, collection_name, date, date], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const updateDocument = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE documents SET data = $1, updated_at = $2 WHERE document_id = $3 RETURNING *', [data, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const deleteDocument = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('DELETE FROM documents WHERE document_id = $1', [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(id);
        });
    });
});
exports.default = {
    getAllDocuments,
    getDocumentById,
    getOneDocumentByParams,
    getAllDocumentsByParams,
    documentExists,
    createDocument,
    updateDocument,
    deleteDocument,
};
//# sourceMappingURL=documents.js.map