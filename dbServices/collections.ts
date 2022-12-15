import pool from '../dbConnection';
import { CollectionData } from '../interfaces';

const getAllCollections = () => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM collections', (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows)
    })
  })
}


const getCollectionById = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM collections WHERE collection_id = $1', [id], (error: any, results: any) => {
      if (error) {
        console.log(error)
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

/* const getCollectionByParams = async (whereString: string, paramsObject: object) =>{
  const values = Object.values(paramsObject);

  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM collections WHERE ${whereString}`, [...values], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
} */

const collectionExists = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM collections WHERE collection_id = $1)`, [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const customCollectionExists = async (whereString: string, paramsObject: object) => {
  const values = Object.values(paramsObject);

  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM collections WHERE ${whereString})`, [...values], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const customGetCollection = async (whereString: string, valueArray: string[]) => {
  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM collections WHERE ${whereString}`, [...valueArray], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const createCollection = (collectionData: CollectionData) => {
  const { name, cluster_id, structure } = collectionData;
  let lowerCaseName = name.toLocaleLowerCase();
  const date = Date.now().toString();
  
  return new Promise((resolve, reject)=>{
    pool.query('INSERT INTO collections (name, structure, cluster_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [lowerCaseName, structure, cluster_id, date, date], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
  
}

const updateCollection = (id: string, updateCollectionData: CollectionData) => {
  const { name } = updateCollectionData;
  let lowerCaseName = name.toLocaleLowerCase();
  // After updating a collection name, you will need to update the name in all documents that belong to that collection
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query(
      'UPDATE collections SET name = $1, updated_at = $2 WHERE collection_id = $3 RETURNING *',
      [lowerCaseName, updated_at, id],
      (error: any, results: any) => {
        if (error) {
          return reject(error.message)
        }
        return resolve(results.rows[0])
      }
    )
  })
}

const deleteCollection = (id: string) => {

  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM collections WHERE collection_id = $1', [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(id)
    })
  })
}

export default {
  getAllCollections,
  getCollectionById,
  //getCollectionByParams,
  collectionExists,
  customCollectionExists,
  customGetCollection,
  createCollection,
  updateCollection,
  deleteCollection,
}

