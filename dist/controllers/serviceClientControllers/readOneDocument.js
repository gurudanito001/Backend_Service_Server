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
exports.readOneDocument = void 0;
const documents_1 = __importDefault(require("../../dbServices/documents"));
const collections_1 = __importDefault(require("../../dbServices/collections"));
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const validator_1 = __importDefault(require("validator"));
const readOneDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { apiKey, collectionName, documentId } = req.params;
    let result = {
        isValidApiKey: validator_1.default.isUUID(apiKey, 4),
        isValidDocumentId: validator_1.default.isUUID(documentId, 4),
    };
    if (!result.isValidApiKey) {
        return res.status(400).json({ message: "apiKey is not valid" });
    }
    else if (!result.isValidDocumentId) {
        return res.status(400).json({ message: "documentId is not valid" });
    }
    try {
        // Database validations
        let clusterExists = yield clusters_1.default.clusterExists(apiKey);
        if (!clusterExists) {
            return res.status(404).json({ message: "Cluster does not exist" });
        }
        let collectionExists = yield collections_1.default.customCollectionExists("cluster_id = $1 AND name = $2 ", { apiKey, collectionName });
        if (!collectionExists) {
            return res.status(404).json({ message: "Collection does not exist" });
        }
        let document = yield documents_1.default.getOneDocumentByParams("cluster_id = $1 AND collection_name = $2 AND document_id = $3", { apiKey, collectionName, documentId });
        if (!document) {
            return res.status(404).json({ message: "Document Not found" });
        }
        return res.status(201).json({
            message: ['Data retreived successfully'],
            status: "success",
            statusCode: 201,
            payload: document
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.readOneDocument = readOneDocument;
//# sourceMappingURL=readOneDocument.js.map