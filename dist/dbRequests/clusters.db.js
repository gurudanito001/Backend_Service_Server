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
exports.createOneCluster = exports.getOneClusterById = exports.getAllClusters = void 0;
const client_1 = require("@prisma/client");
const dbConnection_1 = __importDefault(require("../dbConnection"));
const client = new client_1.PrismaClient();
function getAllClusters() {
    return __awaiter(this, void 0, void 0, function* () {
        let clusters = yield dbConnection_1.default.query('SELECT * from clusters', (error, results) => {
            if (error) {
                throw error;
            }
            return results.rows[0];
        });
        return clusters;
        /* let clusters = await client.clusters.findMany()
        return clusters */
    });
}
exports.getAllClusters = getAllClusters;
function getOneClusterById(cluster_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const cluster = yield client.clusters.findUnique({
            where: {
                cluster_id: cluster_id,
            },
        });
        return cluster;
    });
}
exports.getOneClusterById = getOneClusterById;
function createOneCluster(clusterData) {
    return __awaiter(this, void 0, void 0, function* () {
        let { name, email, password, description, multi_tenant } = clusterData;
        dbConnection_1.default.query('INSERT INTO clusters (name, email, password, description, multi_tenant) VALUES ($1, $2, $3, $4, $5) RETURNING cluster_id', [name, email, password, description, multi_tenant], (error, results) => {
            if (error) {
                throw error;
            }
            return results.rows[0];
        });
    });
}
exports.createOneCluster = createOneCluster;
//# sourceMappingURL=clusters.db.js.map