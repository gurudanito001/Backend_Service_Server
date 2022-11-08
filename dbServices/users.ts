import pool from '../dbConnection';
import { UserData } from '../interfaces';

const getAllUsers = () => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM users', (error: any, results: any) => {
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

const getUserByParams = async (whereString: string, paramsObject: object) =>{
  const values = Object.values(paramsObject);

  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM users WHERE ${whereString}`, [...values], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const userExists = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM users WHERE user_id = $1`, [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const createUser = (userData: UserData) => {
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

const updateUser = (id: string, data: object) => {
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

const deleteUser = (id: string) => {

  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(id)
    })
  })
}

export default {
  getAllUsers,
  getUserById,
  getUserByParams,
  userExists,
  createUser,
  updateUser,
  deleteUser,
}

