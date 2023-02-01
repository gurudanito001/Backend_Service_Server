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
const collections_1 = __importDefault(require("../../dbServices/collections"));
const getCollections = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allCollections = yield collections_1.default.getAllCollections();
        return response.status(200).json({
            message: [`Collections fetched SuccessFully`],
            status: "success",
            statusCode: 200,
            payload: allCollections
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const getCollectionById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let collection = yield collections_1.default.getCollectionById(id);
        if (collection) {
            return response.status(200).json({
                message: [`Collection fetched SuccessFully`],
                status: "success",
                statusCode: 200,
                payload: collection
            });
        }
        return response.status(404).json({ message: "Collection Not Found" });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const createCollection = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { cluster_id, name } = request.body;
    try {
        let collection = yield collections_1.default.createCollection({ cluster_id, name });
        if (collection) {
            return response.status(201).json({
                message: [`Collection created SuccessFully`],
                status: "success",
                statusCode: 201,
                payload: collection
            });
        }
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const updateCollection = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const { name, cluster_id } = request.body;
    try {
        let collection = yield collections_1.default.updateCollection(id, { name, cluster_id });
        if (collection) {
            return response.status(200).json({
                message: [`Collection updated SuccessFully`],
                status: "success",
                statusCode: 200,
                payload: collection
            });
        }
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const deleteCollection = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let collectionId = yield collections_1.default.deleteCollection(id);
        return response.status(200).send({
            message: [`Collection deleted with ID: ${collectionId}`],
            status: "success",
            statusCode: 200,
            payload: null
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.default = {
    getCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
};
//# sourceMappingURL=collections.js.map