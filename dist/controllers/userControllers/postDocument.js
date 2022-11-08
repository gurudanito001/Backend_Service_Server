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
const postDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { apiKey, collectionName } = req.params;
    collectionName = collectionName.toLocaleLowerCase();
    const data = req.body;
    let newCollection;
    let collection_id;
    let newCollectionCreated = false;
    //validate Data. Make sure data types are correct.
    if (!(typeof (data) === "object" && !Array.isArray(data))) {
        return res.status(400).json("data must be an object");
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json("data must not be empty");
    }
    // Database Validations
    try {
        // Check if cluster exists
        let cluster = yield clusters_1.default.getClusterById(apiKey);
        if (!cluster) {
            return res.status(400).json("Cluster does not exist");
        }
        // If Cluster is multi_tenant, user_id is required!!
        /* if(!cluster?.multi_tenant && !data.user_id){
          return res.status(400).json("user_id is required when multi_tenant=true in cluster")
        } */
        // Get Collection_Id if collection exists with collection_name and cluster_id
        let collection = yield collections_1.default.customGetCollection('cluster_id = $1 AND name = $2', [apiKey, collectionName.toLocaleLowerCase()]);
        if (!collection) {
            // create new collection with cluster_id and name
            newCollection = (yield collections_1.default.createCollection({ cluster_id: apiKey, name: collectionName }));
            collection_id = newCollection.collection_id;
            newCollectionCreated = true;
        }
        else {
            collection_id = collection.collection_id;
        }
        // create new document with cluster_id, collection_id and data
        let newDocument = yield documents_1.default.createDocument({ cluster_id: apiKey, collection_id, collection_name: collectionName, data });
        let successMessages = [];
        successMessages.push("New document created");
        newCollectionCreated && successMessages.push("New collection created");
        return res.status(201).json({
            messages: successMessages,
            status: "success",
            statusCode: 201,
            payload: newDocument
        });
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
exports.postDocument = postDocument;
//# sourceMappingURL=postDocument.js.map