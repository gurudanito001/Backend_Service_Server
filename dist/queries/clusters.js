"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { PrismaClient, Prisma } from '@prisma/client'
const dbConnection_1 = __importDefault(require("../dbConnection"));
//import { getAllClusters, getOneClusterById, createOneCluster } from '../dbRequests/clusters.db';
const getClusters = (request, response) => {
    dbConnection_1.default.query('SELECT * from clusters', (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).json(results.rows);
    });
    /* getAllClusters()
    .then(results =>{
      response.status(200).json(results)
    })
    .catch(error =>{
      response.status(400).send(error.response)
    }); */
};
const getClusterById = (request, response) => {
    const clusterId = request.params.id;
    dbConnection_1.default.query('SELECT * from clusters WHERE cluster_id = $1', [clusterId], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        response.status(201).json(results.rows[0]);
    });
    /* getOneClusterById(clusterId)
    .then(results =>{
      response.status(200).json(results)
    })
    .catch(error =>{
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email'
          )
        }
      }
      response.status(400).json(error.response)
    }); */
};
const createCluster = (request, response) => {
    const { name, email, password, description, multi_tenant } = request.body;
    dbConnection_1.default.query('INSERT INTO clusters (name, email, password, description, multi_tenant) VALUES ($1, $2, $3, $4, $5) RETURNING cluster_id', [name, email, password, description, multi_tenant], (error, results) => {
        if (error) {
            return response.status(400).json(error.message);
        }
        return results.rows[0];
    });
    /* createOneCluster({ name, email, password, description, multi_tenant })
    .then(results => {
      response.status(201).json(results)
    })
    .catch(error => {
      response.status(400).json(error)
    });  */
    /* pool.query('INSERT INTO clusters (name, email, password, description, multi_tenant) VALUES ($1, $2, $3, $4, $5) RETURNING cluster_id', [name, email, password, description, multi_tenant], (error: any, results: any) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows[0])
    }) */
};
const updateCluster = (request, response) => {
    const id = request.params.id;
    const { name, email, password, description, multi_tenant } = request.body;
    dbConnection_1.default.query('UPDATE clusters SET name = $1, email = $2, password = $3, description = $4, multi_tenant = $5 WHERE cluster_id = $6 RETURNING cluster_id, name, email, password, description, multi_tenant', [name, email, password, description, multi_tenant, id], (error, results) => {
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