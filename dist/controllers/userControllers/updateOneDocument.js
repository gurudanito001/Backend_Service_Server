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
const updateOneDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { apiKey, collectionName, documentId } = req.params;
    const data = req.body;
    const isValidApiKey = validator_1.default.isUUID(apiKey, 4);
    const isValidDocumentId = validator_1.default.isUUID(documentId, 4);
    //validate Data. Make sure data types are correct.
    if (!(typeof (data) === "object" && !Array.isArray(data))) {
        return res.status(400).json({ error: "Data must be an object" });
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Data must not be empty" });
    }
    if (!isValidApiKey) {
        return res.status(400).json({ error: "apiKey is not valid" });
    }
    if (!isValidDocumentId) {
        return res.status(400).json({ error: "documentId is not valid" });
    }
    try {
        // Database validations
        let clusterExists = yield clusters_1.default.clusterExists(apiKey);
        if (!clusterExists) {
            return res.status(404).json({ error: "Cluster does not exist" });
        }
        let collectionExists = yield collections_1.default.customCollectionExists("cluster_id = $1 AND name = $2 ", { apiKey, collectionName });
        if (!collectionExists) {
            return res.status(404).json({ error: "Collection does not exist" });
        }
        let document = yield documents_1.default.getOneDocumentByParams("cluster_id = $1 AND collection_name = $2 AND document_id = $3", { apiKey, collectionName, documentId });
        if (!document) {
            return res.status(404).json({ error: "Document does not exist" });
        }
        let documentUpdate = Object.assign(Object.assign({}, document.data), data);
        let updatedDocument = yield documents_1.default.updateDocument(documentId, documentUpdate);
        return res.status(201).json({
            messages: ['Document updated'],
            status: "success",
            statusCode: 201,
            payload: updatedDocument
        });
    }
    catch (error) {
        return res.status(400).json({ error });
    }
});
exports.updateOneDocument = updateOneDocument;
//# sourceMappingURL=updateOneDocument.js.map