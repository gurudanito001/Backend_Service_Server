import pool from '../dbConnection';
import { ClusterData } from 'interfaces';

const getAllClusters = () => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM clusters', (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows)
    })
  })
}


const getClusterById = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM clusters WHERE cluster_id = $1', [id], (error: any, results: any) => {
      if (error) {
        console.log(error)
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const getClusterByParams = async (whereString: string, paramsObject: object) =>{
  const values = Object.values(paramsObject);

  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM clusters WHERE ${whereString}`, [...values], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const clusterExists = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM clusters WHERE cluster_id = $1)`, [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const valueExists = async (table: string, column: string, value: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM ${table} WHERE ${column} = $1)`, [value], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const JsonbDataExists = async (table: string, field: string, value: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM ${table} WHERE data->'${field}' = '"${value}"')`,  (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}



const createCluster = (clusterData: ClusterData) => {
  const { name, email, password, description, multi_tenant } = clusterData;
  const date = Date.now().toString();
  
  return new Promise((resolve, reject)=>{
    pool.query('INSERT INTO clusters (name, email, password, description, multi_tenant, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, email, password, description, multi_tenant, date, date], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
  
}

const updateCluster = (id: string, updateClusterData: ClusterData) => {
  const { name, email, password, description, multi_tenant } = updateClusterData;
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query(
      'UPDATE clusters SET name = $1, email = $2, password = $3, description = $4, multi_tenant = $5, updated_at = $6 WHERE cluster_id = $7 RETURNING *',
      [name, email, password, description, multi_tenant, updated_at, id],
      (error: any, results: any) => {
        if (error) {
          return reject(error.message)
        }
        return resolve(results.rows[0])
      }
    )
  })
}

const deActivateCluster = async (id: string) =>{
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query('UPDATE clusters SET isActive = $1, updated_at = $2 WHERE cluster_id = $3 RETURNING *', [false, updated_at, id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const reActivateCluster = async (id: string) =>{
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query('UPDATE clusters SET isActive = $1, updated_at = $2 WHERE cluster_id = $3 RETURNING *', [true, updated_at, id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const deleteCluster = (id: string) => {

  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM clusters WHERE cluster_id = $1', [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(id)
    })
  })
  
}

export default {
  getAllClusters,
  getClusterById,
  getClusterByParams,
  clusterExists,
  valueExists,
  JsonbDataExists,
  createCluster,
  updateCluster,
  deActivateCluster,
  reActivateCluster,
  deleteCluster,
}

