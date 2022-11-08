import pool from '../dbConnection';
import { DocumentData } from '../interfaces';

const getAllDocuments = () => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM documents', (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows)
    })
  })
}


const getDocumentById = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query('SELECT * FROM documents WHERE document_id = $1', [id], (error: any, results: any) => {
      if (error) {
        console.log(error)
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const getDocumentByParams = async (whereString: string, paramsObject: object) =>{
  const values = Object.values(paramsObject);

  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM documents WHERE ${whereString}`, [...values], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
}

const documentExists = async (id: string) => {
  return new Promise((resolve, reject)=>{
    pool.query(`select exists(SELECT * FROM documents WHERE document_id = $1`, [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0].exists)
    })
  })
}

const createDocument = (documentData: DocumentData) => {
  const { cluster_id, collection_id, user_id, collection_name, data } = documentData;
  const date = Date.now().toString();
  
  return new Promise((resolve, reject)=>{
    pool.query('INSERT INTO documents (cluster_id, collection_id, user_id, data, collection_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [cluster_id, collection_id, user_id, data, collection_name, date, date], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
  
}

const updateDocument = (id: string, data: object) => {
  const updated_at = Date.now().toString();

  return new Promise((resolve, reject)=>{
    pool.query(
      'UPDATE documents SET data = $1, updated_at = $2 WHERE document_id = $3 RETURNING *',
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

const deleteDocument = (id: string) => {

  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM documents WHERE document_id = $1', [id], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(id)
    })
  })
}

export default {
  getAllDocuments,
  getDocumentById,
  getDocumentByParams,
  documentExists,
  createDocument,
  updateDocument,
  deleteDocument,
}

