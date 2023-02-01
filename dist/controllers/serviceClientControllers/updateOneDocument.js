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
exports.updateOneDocument = void 0;
const documents_1 = __importDefault(require("../../dbServices/documents"));
const collections_1 = __importDefault(require("../../dbServices/collections"));
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const validator_1 = __importDefault(require("validator"));
const doesDataMatchStructure_1 = require("../../services/doesDataMatchStructure");
const updateOneDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { apiKey, collectionName, documentId } = req.params;
    const data = req.body;
    const isValidApiKey = validator_1.default.isUUID(apiKey, 4);
    const isValidDocumentId = validator_1.default.isUUID(documentId, 4);
    //validate Data. Make sure data types are correct.
    if (!(typeof (data) === "object" && !Array.isArray(data))) {
        return res.status(400).json({ message: "Data must be an object" });
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Data must not be empty" });
    }
    if (!isValidApiKey) {
        return res.status(400).json({ message: "apiKey is not valid" });
    }
    if (!isValidDocumentId) {
        return res.status(400).json({ message: "documentId is not valid" });
    }
    try {
        // Database validations
        let clusterExists = yield clusters_1.default.clusterExists(apiKey);
        if (!clusterExists) {
            return res.status(404).json({ message: "Cluster does not exist" });
        }
        let collection = yield collections_1.default.customGetCollection('cluster_id = $1 AND name = $2', [apiKey, collectionName.toLocaleLowerCase()]);
        if (!collection) {
            return res.status(404).json({ message: "Collection does not exist" });
        }
        let dataMatchesCollection = (0, doesDataMatchStructure_1.doesDataMatchStructure)(data, collection.structure);
        if (!dataMatchesCollection) {
            return res.status(400).json({ message: `Data does not match '${collectionName}' structure` });
        }
        let document = yield documents_1.default.getOneDocumentByParams("cluster_id = $1 AND collection_name = $2 AND document_id = $3", { apiKey, collectionName, documentId });
        if (!document) {
            return res.status(404).json({ message: "Document does not exist" });
        }
        let documentUpdate = Object.assign(Object.assign({}, document.data), data);
        let updatedDocument = yield documents_1.default.updateDocument(documentId, documentUpdate);
        return res.status(201).json({
            message: ['Document updated successfully'],
            status: "success",
            statusCode: 201,
            payload: updatedDocument
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateOneDocument = updateOneDocument;
//# sourceMappingURL=updateOneDocument.js.map