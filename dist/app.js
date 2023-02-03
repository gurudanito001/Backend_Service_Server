"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clusters_1 = __importDefault(require("./controllers/adminControllers/clusters"));
const users_1 = __importDefault(require("./controllers/adminControllers/users"));
const collections_1 = __importDefault(require("./controllers/adminControllers/collections"));
const documents_1 = __importDefault(require("./controllers/adminControllers/documents"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const postDocument_1 = require("./controllers/serviceClientControllers/postDocument");
const readOneDocument_1 = require("./controllers/serviceClientControllers/readOneDocument");
const readAllDocuments_1 = require("./controllers/serviceClientControllers/readAllDocuments");
const updateOneDocument_1 = require("./controllers/serviceClientControllers/updateOneDocument");
const deleteOneDocument_1 = require("./controllers/serviceClientControllers/deleteOneDocument");
const getAllUsers_1 = require("./controllers/serviceClientControllers/getAllUsers");
const getUserById_1 = require("./controllers/serviceClientControllers/getUserById");
const authControllers_1 = require("./controllers/adminControllers/authControllers");
const authControllers_2 = require("./controllers/serviceClientControllers/authControllers");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)());
app.get('/hello', (req, res) => {
    res.send("hello");
});
// ADMIN ENDPOINTS 
//app.post('/sendEmail', sendAnEmail);
app.post('/clusters/register', authControllers_1.registerCluster);
app.post('/clusters/login', authControllers_1.authenticateCluster);
app.get('/clusters/confirmEmail/:token', authControllers_1.confirmClusterEmail);
app.post('/clusters/resendVerificationLink/:email', authControllers_1.resendClusterVerificationLink);
app.post('/clusters/resetPassword/', authControllers_1.resetClusterPassword);
app.post('/clusters/changePassword/:token', authControllers_1.changeClusterPassword);
app.get('/clusters', clusters_1.default.getClusters);
app.get('/clusters/:id', clusters_1.default.getClusterById);
app.put('/clusters/:id', clusters_1.default.updateCluster);
app.post('/clusters/freeze/:id', clusters_1.default.deActivateCluster);
app.post('/clusters/unfreeze/:id', clusters_1.default.reActivateCluster);
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
app.get('/userStructures', users_1.default.getStructures);
app.get('/userStructures/:id', users_1.default.getStructureByClusterId);
app.delete('/userStructures/:id', users_1.default.deleteStructure);
app.get('/documents', documents_1.default.getDocuments);
app.get('/documents/:id', documents_1.default.getDocumentById);
app.post('/documents/create', documents_1.default.createDocument);
app.put('/documents/:id', documents_1.default.updateDocument);
app.delete('/documents/:id', documents_1.default.deleteDocument);
//SERVICE USER ENDPOINTS
//auth endpoints
app.post('/api/v1/users/register', authControllers_2.registerUser);
app.post('/api/v1/users/login', authControllers_2.authenticateUser);
app.get('/api/v1/users/confirmEmail/:token', authControllers_2.confirmUserEmail);
app.post('/api/v1/users/resendVerificationLink/:email', authControllers_2.resendVerificationLink);
app.post('/api/v1/users/resetPassword', authControllers_2.resetUserPassword);
app.post('/api/v1/users/changePassword/:token', authControllers_2.changeUserPassword);
// crud endpoints users
// get all users
app.get('/api/v1/:apiKey/users', getAllUsers_1.getAllUsers);
// get one user
app.get('/api/v1/users/:userId', getUserById_1.getUserById);
// update one user 
app.post('/api/v1/users/:userId', getUserById_1.getUserById);
// delete one user
// crud endpoints documents
app.post('/api/v1/:apiKey/:collectionName', postDocument_1.postDocument);
app.get('/api/v1/:apiKey/:collectionName/:documentId', readOneDocument_1.readOneDocument);
app.get('/api/v1/:apiKey/:collectionName', readAllDocuments_1.readAllDocuments);
app.post('/api/v1/:apiKey/:collectionName/:documentId', updateOneDocument_1.updateOneDocument);
app.delete('/api/v1/:apiKey/:collectionName/:documentId', deleteOneDocument_1.deleteOneDocument);
exports.default = app;
//# sourceMappingURL=app.js.map