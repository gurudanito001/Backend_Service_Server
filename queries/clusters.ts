import { Request, Response} from 'express';
//import { PrismaClient, Prisma } from '@prisma/client'
import pool from '../dbConnection'
//import { getAllClusters, getOneClusterById, createOneCluster } from '../dbRequests/clusters.db';



const getClusters = (request: Request, response: Response) => {
  pool.query('SELECT * from clusters', (error: any, results: any) =>{
    if(error){
      return response.status(400).json(error.message)
    }
    response.status(201).json(results.rows)
  })

}

const getClusterById = (request: Request, response: Response) => {
  const clusterId = request.params.id;

  pool.query('SELECT * from clusters WHERE cluster_id = $1', [clusterId], (error: any, results: any) =>{
    if(error){
      return response.status(400).json(error.message)
    }
    response.status(201).json(results.rows[0])
  })

}

const createCluster = (request: Request, response: Response) => {
  const { name, email, password, description, multi_tenant } = request.body;

  pool.query('INSERT INTO clusters (name, email, password, description, multi_tenant) VALUES ($1, $2, $3, $4, $5) RETURNING cluster_id', [name, email, password, description, multi_tenant], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(201).json(results.rows[0])
  })
  
}

const updateCluster = (request: Request, response: Response) => {
  const id = request.params.id
  const { name, email, password, description, multi_tenant } = request.body

  pool.query(
    'UPDATE clusters SET name = $1, email = $2, password = $3, description = $4, multi_tenant = $5 WHERE cluster_id = $6 RETURNING cluster_id, name, email, password, description, multi_tenant',
    [name, email, password, description, multi_tenant, id],
    (error: any, results: any) => {
      if (error) {
        return response.status(400).json(error.message)
      }
      response.status(201).send(results.rows[0])
    }
  )
}

const deActivateCluster = (request: Request, response: Response) => {
  const id = request.params.id

  pool.query('UPDATE clusters SET isActive = $1 WHERE cluster_id = $2', [false, id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).send(`Cluster Deactivated with ID: ${id}`)
  })
}

const reActivateCluster = (request: Request, response: Response) => {
  const id = request.params.id

  pool.query('UPDATE clusters SET isActive = $1 WHERE cluster_id = $2', [true, id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).send(`Cluster Activated with ID: ${id}`)
  })
}

const deleteCluster = (request: Request, response: Response) => {
  const id = request.params.id

  pool.query('DELETE FROM clusters WHERE cluster_id = $1', [id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).send(`Cluster deleted with ID: ${id}`)
  })
}



export default {
  getClusters,
  getClusterById,
  createCluster,
  updateCluster,
  deActivateCluster,
  reActivateCluster,
  deleteCluster,
}

