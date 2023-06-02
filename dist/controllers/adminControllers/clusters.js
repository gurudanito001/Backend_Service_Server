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
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
/* import bcrypt from 'bcrypt';
import config from '../../config';
import  Jwt  from 'jsonwebtoken';
import { ClusterData } from 'interfaces';
import sendEmail from '../../services/sendEmail'; */
const getClusters = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allClusters = yield clusters_1.default.getAllClusters();
        return response.status(200).json({
            message: ["Clusters Fetched Successfully"],
            status: "success",
            statusCode: 200,
            payload: allClusters
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const getClusterById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const clusterId = request.params.id;
    try {
        let cluster = yield clusters_1.default.getClusterById(clusterId);
        if (cluster) {
            return response.status(200).json({
                message: ["Cluster Fetched Successfully"],
                status: "success",
                statusCode: 200,
                payload: cluster
            });
        }
        return response.status(404).json({ message: "Cluster Not Found" });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const updateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const newData = request.body;
    try {
        let clusterData = yield clusters_1.default.getClusterById(id);
        let cluster = yield clusters_1.default.updateCluster(id, Object.assign(Object.assign({}, clusterData), newData));
        if (cluster) {
            return response.status(200).json({
                message: ["Cluster Updated Successfully"],
                status: "success",
                statusCode: 200,
                payload: cluster
            });
        }
    }
    catch (error) {
        return response.status(400).json({ message: error });
    }
});
const deActivateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let cluster = yield clusters_1.default.deActivateCluster(id);
        return response.status(200).json({
            message: ["Cluster Deactivated Successfully"],
            status: "success",
            statusCode: 200,
            payload: cluster
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const reActivateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let cluster = yield clusters_1.default.reActivateCluster(id);
        return response.status(200).json({
            message: ["Cluster Reactivated Successfully"],
            status: "success",
            statusCode: 200,
            payload: cluster
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const deleteCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let clusterId = yield clusters_1.default.deleteCluster(id);
        return response.status(200).json({
            message: [`Cluster deleted with ID: ${clusterId}`],
            status: "success",
            statusCode: 200,
            payload: null
        });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
exports.default = {
    getClusters,
    getClusterById,
    updateCluster,
    deActivateCluster,
    reActivateCluster,
    deleteCluster,
};
//# sourceMappingURL=clusters.js.map