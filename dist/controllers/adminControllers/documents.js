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
const documents_1 = __importDefault(require("../../dbServices/documents"));
const getDocuments = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allDocuments = yield documents_1.default.getAllDocuments();
        return response.status(201).json(allDocuments);
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const getDocumentById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let document = yield documents_1.default.getDocumentById(id);
        if (document) {
            return response.status(201).json(document);
        }
        return response.status(404).json({ error: "Document Not Found" });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const createDocument = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, collection_id, cluster_id, collection_name, data } = request.body;
    try {
        let document = yield documents_1.default.createDocument({ user_id, collection_id, cluster_id, collection_name, data });
        if (document) {
            return response.status(201).json(document);
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const updateDocument = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    let newDocument = request.body;
    try {
        let oldDocument = yield documents_1.default.getDocumentById(id);
        if (!oldDocument) {
            return response.status(400).send(`Document with ID:${id} does not exist`);
        }
        let newData = Object.assign(Object.assign({}, oldDocument.data), newDocument.data);
        let document = yield documents_1.default.updateDocument(id, newData);
        if (document) {
            return response.status(201).json(document);
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const deleteDocument = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let documentId = yield documents_1.default.deleteDocument(id);
        return response.status(200).send({ message: `Document deleted with ID: ${documentId}` });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
exports.default = {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
};
//# sourceMappingURL=documents.js.map