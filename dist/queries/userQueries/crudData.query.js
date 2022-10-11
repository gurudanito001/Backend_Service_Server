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
const dbConnection_1 = __importDefault(require("../../dbConnection"));
const errorService_1 = __importDefault(require("../../services/errorService"));
function postData(postData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, collection_name, data, env } = postData;
        let createCollectionResult;
        let collection_id;
        let newCollectionCreated = false;
        // check if there is a cluster with cluster_id of apiKey
        let clusterQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
        if (!clusterQueryResult.rows[0].exists) {
            throw new errorService_1.default(["Cluster does not exist"], 404);
        }
        // check if collection exists with apiKey as cluster_id and name as collectionName
        let collectionQueryResult = yield dbConnection_1.default.query('SELECT * FROM collections WHERE cluster_id = $1 AND name = $2', [apiKey, collection_name]);
        if (collectionQueryResult.rows.length === 0) {
            // create new collection with cluster_id and name
            createCollectionResult = yield dbConnection_1.default.query('INSERT INTO collections (cluster_id, name) VALUES ($1, $2)  RETURNING collection_id', [apiKey, collection_name]);
            collection_id = createCollectionResult.rows[0].collection_id;
            newCollectionCreated = true;
        }
        else {
            collection_id = collectionQueryResult.rows[0].collection_id;
        }
        // create new document with cluster_id, collection_id and data
        let createDocumentResult = yield dbConnection_1.default.query('INSERT INTO documents (cluster_id, collection_id, collection_name, data) VALUES ($1, $2, $3, $4) RETURNING document_id, cluster_id, collection_id, collection_name, data', [apiKey, collection_id, collection_name, data]);
        if (!createDocumentResult.rows[0].document_id) {
            throw new Error("Unable to create document");
        }
        let successMessages = [];
        successMessages.push("New document created");
        newCollectionCreated && successMessages.push("New collection created");
        return {
            messages: successMessages,
            status: "success",
            statusCode: 201,
            payload: createDocumentResult.rows[0]
        };
    });
}
function readAllData(readAllData) {
    return __awaiter(this, void 0, void 0, function* () {
        let { apiKey, collection_name } = readAllData;
        let documentQueryResult = yield dbConnection_1.default.query('SELECT * FROM documents WHERE cluster_id = $1 AND collection_name = $2', [apiKey, collection_name]);
        if (!Boolean(documentQueryResult.rows.length)) {
            let clusterQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
            if (!clusterQueryResult.rows[0].exists) {
                throw new Error("Cluster does not exist");
            }
            let collectionQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM collections WHERE cluster_id = $1 AND name = $2)', [apiKey, collection_name]);
            if (!collectionQueryResult.rows[0].exists) {
                throw new Error("Collection does not exist");
            }
            throw new Error("No Document Found in this collection");
        }
        else {
            return {
                messages: ["Data Fetched successfully"],
                status: "success",
                statusCode: 201,
                payload: documentQueryResult.rows
            };
        }
    });
}
function readOneData(readOneData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let { apiKey, collection_name, document_id } = readOneData;
        const clusterId = apiKey;
        let documentQueryResult = yield dbConnection_1.default.query('SELECT * FROM documents WHERE cluster_id = $1 AND collection_name = $2 AND document_id = $3', [apiKey, collection_name, document_id]);
        if (!Boolean((_a = documentQueryResult === null || documentQueryResult === void 0 ? void 0 : documentQueryResult.rows) === null || _a === void 0 ? void 0 : _a.length)) { //to be true length has to be 0
            let clusterQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
            if (!clusterQueryResult.rows[0].exists) {
                throw new Error("Cluster does not exist");
            }
            let collectionQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM collections WHERE cluster_id = $1 AND name = $2)', [apiKey, collection_name]);
            if (!collectionQueryResult.rows[0].exists) {
                throw new Error("Collection does not exist");
            }
            throw new Error("Document does not exist");
        }
        else {
            return {
                messages: ["Data Fetched successfully"],
                status: "success",
                statusCode: 201,
                payload: documentQueryResult.rows[0]
            };
        }
    });
}
function updateOneData(updateOneData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let { apiKey, collection_name, document_id, data } = updateOneData;
        let documentQueryResult = yield dbConnection_1.default.query('SELECT * FROM documents WHERE cluster_id = $1 AND collection_name = $2 AND document_id = $3', [apiKey, collection_name, document_id]);
        if (!Boolean((_a = documentQueryResult === null || documentQueryResult === void 0 ? void 0 : documentQueryResult.rows) === null || _a === void 0 ? void 0 : _a.length)) {
            let clusterQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
            if (!clusterQueryResult.rows[0].exists) {
                throw new Error("Cluster does not exist");
            }
            let collectionQueryResult = yield dbConnection_1.default.query('select exists(SELECT * FROM collections WHERE cluster_id = $1 AND name = $2)', [apiKey, collection_name]);
            if (!collectionQueryResult.rows[0].exists) {
                throw new Error("Collection does not exist");
            }
            throw new Error("Document does not exist");
        }
        else {
            let newData = Object.assign(Object.assign({}, documentQueryResult.rows[0].data), data);
            let updatedDocument = yield dbConnection_1.default.query('UPDATE documents SET data = $1 WHERE document_id = $2 AND cluster_id = $3 AND collection_name = $4 RETURNING *', [newData, document_id, apiKey, collection_name]);
            return {
                messages: ['Document updated'],
                status: "success",
                statusCode: 201,
                payload: updatedDocument.rows
            };
        }
    });
}
function deleteOneData(deleteOneData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { apiKey, collection_name, document_id } = deleteOneData;
        let deletedData = yield dbConnection_1.default.query('DELETE FROM documents WHERE document_id = $1 AND cluster_id = $2 AND collection_name = $3 RETURNING document_id', [document_id, apiKey, collection_name]);
        if (!(deletedData === null || deletedData === void 0 ? void 0 : deletedData.rows)) {
            throw new Error("Error deleting document");
        }
        return {
            messages: [`Document deleted with id: ${document_id}`],
            status: "success",
            statusCode: 201,
            payload: deletedData.rows[0]
        };
    });
}
exports.default = {
    postData,
    readAllData,
    readOneData,
    updateOneData,
    deleteOneData
};
//# sourceMappingURL=crudData.query.js.map