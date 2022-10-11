import { Request, Response} from 'express';
import pool from '../dbConnection';

const getDocuments = (request: Request, response: Response) => {
  pool.query('SELECT * FROM documents', (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).json(results.rows)
  })
}

const getDocumentById = (request: Request, response: Response) => {
  const id = request.params.id;

  pool.query('SELECT * FROM documents WHERE document_id = $1', [id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).json(results.rows[0])
  })
}

const createDocument = (request: Request, response: Response) => {
  const { cluster_id, collection_id, user_id, data } = request.body;
  
  pool.query('INSERT INTO documents (cluster_id, collection_id, user_id, data) VALUES ($1, $2, $3, $4)', [cluster_id, collection_id, user_id, data], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(201).send(`New Document Created`);
  })
}

const updateDocument = (request: Request, response: Response) => {
  const id = request.params.id;
  const {cluster_id, collection_id, user_id, data} = request.body;

  pool.query(
    'UPDATE documents SET data = $1 WHERE document_id = $2',
    [data, id],
    (error: any, results: any) => {
      if (error) {
        return response.status(400).json(error.message)
      }
      response.status(200).send(`Document modified with ID: ${id}`)
    }
  )
}

const deleteDocument = (request: Request, response: Response) => {
  const id = request.params.id

  pool.query('DELETE FROM documents WHERE document_id = $1', [id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).send(`Document deleted with ID: ${id}`)
  })
}

export default {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
}

