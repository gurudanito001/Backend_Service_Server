"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneData = exports.updateOneData = exports.readOneData = exports.readAllData = exports.postData = void 0;
const crudData_query_1 = __importDefault(require("../controllers/userControllers/crudData.query"));
const postData = (req, res) => {
    const { apiKey, collectionName } = req.params;
    const data = req.body;
    let postDataParams = { apiKey, collection_name: collectionName, data };
    let errors = [];
    if (Array.isArray(data)) {
        errors.push("Data must be an object");
    }
    if (Object.keys(data).length === 0) {
        errors.push("Data must not be empty");
    }
    if (errors.length > 0) {
        return res.status(400).json({
            messages: ["Invalid value(s)"],
            status: "failed",
            statusCode: 400,
            errors: errors
        });
    }
    crudData_query_1.default.postData(postDataParams)
        .then((data) => {
        return res.status(data.statusCode).json(data);
    })
        .catch((err) => {
        let error = {
            errors: err.errors,
            statusCode: err.statusCode,
            status: err.status,
            payload: err.payload
        };
        res.status(err.statusCode).json(error);
    });
};
exports.postData = postData;
const readAllData = (req, res) => {
    const { apiKey, collectionName } = req.params;
    crudData_query_1.default.readAllData({ apiKey, collection_name: collectionName })
        .then((data) => {
        return res.status((data === null || data === void 0 ? void 0 : data.statusCode) || 201).json(data);
    })
        .catch((err) => {
        let error = {
            errors: err.message,
            statusCode: 400,
            status: "failed",
            payload: null
        };
        res.status(400).json(error);
    });
};
exports.readAllData = readAllData;
const readOneData = (req, res) => {
    const { apiKey, collectionName, documentId } = req.params;
    crudData_query_1.default.readOneData({ apiKey, collection_name: collectionName, document_id: documentId })
        .then((data) => {
        return res.status(data.statusCode).json(data);
    })
        .catch((err) => {
        let error = {
            errors: err.message,
            statusCode: 400,
            status: "failed",
            payload: null
        };
        res.status(400).json(error);
    });
};
exports.readOneData = readOneData;
const updateOneData = (req, res) => {
    const { apiKey, collectionName, documentId } = req.params;
    const data = req.body;
    let errors = [];
    if (Array.isArray(data)) {
        errors.push("Data must be an object");
    }
    if (Object.keys(data).length === 0) {
        errors.push("Data must not be empty");
    }
    if (errors.length > 0) {
        return res.status(400).json({
            messages: ["Invalid value(s)"],
            status: "failed",
            statusCode: 400,
            errors: errors
        });
    }
    crudData_query_1.default.updateOneData({ apiKey, collection_name: collectionName, document_id: documentId, data })
        .then((data) => {
        console.log;
        return res.status(201).json(data);
    })
        .catch((err) => {
        let error = {
            errors: err.message,
            statusCode: 400,
            status: "failed",
            payload: null
        };
        res.status(400).json(error);
    });
};
exports.updateOneData = updateOneData;
const deleteOneData = (req, res) => {
    const { apiKey, collectionName, documentId } = req.params;
    crudData_query_1.default.deleteOneData({ apiKey, collection_name: collectionName, document_id: documentId })
        .then((data) => {
        return res.status(201).json(data);
    })
        .catch((err) => {
        let error = {
            errors: err.message,
            statusCode: 400,
            status: "failed",
            payload: null
        };
        res.status(400).json(error);
    });
};
exports.deleteOneData = deleteOneData;
//# sourceMappingURL=crudData.controller.js.map