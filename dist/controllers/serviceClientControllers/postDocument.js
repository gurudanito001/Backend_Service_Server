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
exports.postDocument = void 0;
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const collections_1 = __importDefault(require("../../dbServices/collections"));
const documents_1 = __importDefault(require("../../dbServices/documents"));
const validator_1 = __importDefault(require("validator"));
const generateDataStructure_1 = __importDefault(require("../../services/generateDataStructure"));
const doesDataMatchStructure_1 = require("../../services/doesDataMatchStructure");
const postDocument = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { apiKey, collectionName } = request.params;
    collectionName = collectionName.toLocaleLowerCase();
    const data = request.body;
    let newCollection;
    let collection_id;
    let newCollectionCreated = false;
    const isValidApiKey = validator_1.default.isUUID(apiKey, 4);
    //validate Data. Make sure data types are correct.
    if (!(typeof (data) === "object" && !Array.isArray(data))) {
        return response.status(400).json({ message: "data must be an object" });
    }
    if (Object.keys(data).length === 0) {
        return response.status(400).json({ message: "data must not be empty" });
    }
    if (!isValidApiKey) {
        return response.status(400).json({ message: "apiKey is not valid" });
    }
    try {
        /* Database Validations begin */
        // Check if cluster exists
        let cluster = yield clusters_1.default.getClusterById(apiKey);
        if (!cluster) {
            return response.status(400).json({ message: "Cluster does not exist" });
        }
        // If Cluster is multi_tenant, user_id is required!!
        /* if(!cluster?.multi_tenant && !data.user_id){
          return response.status(400).json("user_id is required when multi_tenant=true in cluster")
        } */
        // Get Collection_Id if collection exists with collection_name and cluster_id
        let collection = yield collections_1.default.customGetCollection('cluster_id = $1 AND name = $2', [apiKey, collectionName.toLocaleLowerCase()]);
        if (!collection) {
            // create new collection with cluster_id and name
            let dataStructure = (0, generateDataStructure_1.default)(data);
            newCollection = (yield collections_1.default.createCollection({ cluster_id: apiKey, name: collectionName, structure: dataStructure }));
            collection_id = newCollection.collection_id;
            newCollectionCreated = true;
        }
        else {
            let dataMatchesCollection = (0, doesDataMatchStructure_1.doesDataMatchStructure)(data, collection.structure);
            if (!dataMatchesCollection) {
                return response.status(400).json({ message: `Data does not match '${collectionName}' structure` });
            }
            collection_id = collection.collection_id;
        }
        /* Database Validations end */
        // create new document with cluster_id, collection_id and data
        let newDocument = yield documents_1.default.createDocument({ cluster_id: apiKey, collection_id, collection_name: collectionName, data });
        let successMessages = [];
        successMessages.push("New document created");
        newCollectionCreated && successMessages.push("New collection created");
        return response.status(201).json({
            message: successMessages,
            status: "success",
            statusCode: 201,
            payload: newDocument
        });
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.postDocument = postDocument;
//# sourceMappingURL=postDocument.js.map