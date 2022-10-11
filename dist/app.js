"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clusters_1 = __importDefault(require("./queries/clusters"));
const users_1 = __importDefault(require("./queries/users"));
const collections_1 = __importDefault(require("./queries/collections"));
const documents_1 = __importDefault(require("./queries/documents"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const crudData_controller_1 = require("./userControllers/crudData.controller");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)());
app.get('/clusters', clusters_1.default.getClusters);
app.get('/clusters/:id', clusters_1.default.getClusterById);
app.post('/clusters/create', clusters_1.default.createCluster);
app.put('/clusters/:id', clusters_1.default.updateCluster);
app.patch('/clusters/freeze/:id', clusters_1.default.deActivateCluster);
app.patch('/clusters/unfreeze/:id', clusters_1.default.reActivateCluster);
app.delete('/clusters/:id', clusters_1.default.deleteCluster);
app.get('/collections', collections_1.default.getCollections);
app.get('/collections/:id', collections_1.default.getCollectionById);
app.post('/collections/create', collections_1.default.createCollection);
app.put('/collections/:id', collections_1.default.updateCollection);
app.delete('/collections/:id', collections_1.default.deleteCollection);
app.get('/users', users_1.default.getUsers);
app.get('/users/:id', users_1.default.getUserById);
app.post('/users/create', users_1.default.createUser);
app.put('/users/:id', users_1.default.updateUser);
app.delete('/users/:id', users_1.default.deleteUser);
app.get('/documents', documents_1.default.getDocuments);
app.get('/documents/:id', documents_1.default.getDocumentById);
app.post('/documents/create', documents_1.default.createDocument);
app.put('/documents/:id', documents_1.default.updateDocument);
app.delete('/documents/:id', documents_1.default.deleteDocument);
app.post('/:apiKey/:collectionName/create', crudData_controller_1.postData);
app.get('/:apiKey/:collectionName/read', crudData_controller_1.readAllData);
app.get('/:apiKey/:collectionName/read/:documentId', crudData_controller_1.readOneData);
app.patch('/:apiKey/:collectionName/update/:documentId', crudData_controller_1.updateOneData);
app.delete('/:apiKey/:collectionName/delete/:documentId', crudData_controller_1.deleteOneData);
exports.default = app;
//# sourceMappingURL=app.js.map