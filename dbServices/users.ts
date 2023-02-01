import pool from '../dbConnection';
import { UserData } from '../interfaces';
import structureGenerator from '../services/generateDataStructure';

const getAllUsers = async () => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM users', (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows)
    })
  })
}

const getAllUsersByClusterId = async (cluster_id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM users WHERE cluster_id = $1', [cluster_id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows)
    })
  })
}


const getUserById = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error: any, results: any) => {
      if (error) {
        console.log(error)
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const getUserByParams = async (whereString: string, valuesArray: any[]) =>{

  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM users WHERE ${whereString}`, [...valuesArray], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const getUserByJsonbData = async (field: string, value: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM users WHERE data->'${field}' = '"${value}"'`,  (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const userExists = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM users WHERE user_id = $1)`, [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const createUser = async (userData: UserData) => {
  const { cluster_id, data } = userData;
  const date = Date.now().toString();
  
  return new Promise((resolve, reject)=>{
    pool.query('INSERT INTO users (cluster_id, data, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [cluster_id, data, date, date], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
  
}

const updateUser = async (id: string, data: object) => {
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query(
      'UPDATE users SET data = $1, updated_at = $2 WHERE user_id = $3 RETURNING *',
      [data, updated_at, id],
      (error: any, results: any) => {
        if (error) {
          return reject(error.message)
        }
        return resolve(results.rows[0])
      }
    )
  })
}

const verifyEmail = async (id: string) => {
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query(
      `UPDATE users SET email_confirmed = $1, updated_at = $2 WHERE user_id = $3 RETURNING *`,
      [true, updated_at, id],
      (error: any, results: any) => {
        if (error) {
          return reject(error.message)
        }
        return resolve(results.rows[0])
      }
    )
  })
}

const deleteUser = async (id: string) => {

  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(id)
    })
  })
}

const createUserDataStructure = async (cluster_id: string, data: object) =>{
  let structure = structureGenerator(data);
  const date = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query('INSERT INTO user_data_structure (cluster_id, structure, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [cluster_id, structure, date, date], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const structureExists = async (cluster_id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM user_data_structure WHERE cluster_id = $1)`, [cluster_id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const getStructureByClusterId = async (cluster_id: string)=>{
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM user_data_structure WHERE cluster_id = $1', [cluster_id], (error: any, results: any) => {
      if (error) {
        console.log(error)
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}


const getAllStructures = async () => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM user_data_structure', (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows)
    })
  })
}

const deleteStructure = async (cluster_id: string) => {

  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM user_data_structure WHERE cluster_id = $1', [cluster_id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(cluster_id)
    })
  })
}


export default {
  getAllUsers,
  getAllUsersByClusterId,
  getUserById,
  getUserByParams,
  getUserByJsonbData,
  userExists,
  createUser,
  updateUser,
  verifyEmail,
  deleteUser,
  createUserDataStructure,
  structureExists,
  getStructureByClusterId,
  getAllStructures,
  deleteStructure
}

