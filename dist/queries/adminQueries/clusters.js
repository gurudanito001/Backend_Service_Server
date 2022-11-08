"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { PrismaClient, Prisma } from '@prisma/client'
const dbConnection_1 = __importDefault(require("../../dbConnection"));
//import { getAllClusters, getOneClusterById, createOneCluster } from '../dbRequests/clusters.db';
const getClusters = (request, response) => {
    dbConnection_1.default.query('SELECT * from clusters', (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).json(results.rows);
    });
};
const getClusterById = (request, response) => {
    const clusterId = request.params.id;
    dbConnection_1.default.query('SELECT * from clusters WHERE cluster_id = $1', [clusterId], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).json(results.rows[0]);
    });
};
const createCluster = (request, response) => {
    const { name, email, password, description, multi_tenant } = request.body;
    const date = Date.now().toString();
    dbConnection_1.default.query('INSERT INTO clusters (name, email, password, description, multi_tenant, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, email, password, description, multi_tenant, date, date], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).json(results.rows[0]);
    });
};
const updateCluster = (request, response) => {
    const id = request.params.id;
    const { name, email, password, description, multi_tenant } = request.body;
    const updated_at = Date.now().toString();
    dbConnection_1.default.query('UPDATE clusters SET name = $1, email = $2, password = $3, description = $4, multi_tenant = $5, updated_at = $6 WHERE cluster_id = $7 RETURNING *', [name, email, password, description, multi_tenant, updated_at, id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).send(results.rows[0]);
    });
};
const deActivateCluster = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('UPDATE clusters SET isActive = $1 WHERE cluster_id = $2', [false, id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Cluster Deactivated with ID: ${id}`);
    });
};
const reActivateCluster = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('UPDATE clusters SET isActive = $1 WHERE cluster_id = $2', [true, id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Cluster Activated with ID: ${id}`);
    });
};
const deleteCluster = (request, response) => {
    const id = request.params.id;
    dbConnection_1.default.query('DELETE FROM clusters WHERE cluster_id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(200).send(`Cluster deleted with ID: ${id}`);
    });
};
exports.default = {
    getClusters,
    getClusterById,
    createCluster,
    updateCluster,
    deActivateCluster,
    reActivateCluster,
    deleteCluster,
};
//# sourceMappingURL=clusters.js.map