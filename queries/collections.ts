import { Request, Response} from 'express';
import pool from '../dbConnection'


const getCollections = (request: Request, response: Response) => {
  pool.query('SELECT * FROM collections', (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).json(results.rows)
  })
}

const getCollectionById = (request: Request, response: Response) => {
  const id = request.params.id;

  pool.query('SELECT * FROM collections WHERE collection_id = $1', [id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).json(results.rows)
  })
}



const createCollection = (request: Request, response: Response) => {
  const { cluster_id, user_id, name } = request.body;
  
  pool.query('INSERT INTO collections (cluster_id, user_id, name) VALUES ($1, $2, $3)', [cluster_id, user_id, name], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(201).send(`New Collection Created`)
  })
}

const updateCollection = (request: Request, response: Response) => {
  const id = request.params.id
  const { cluster_id, user_id, name } = request.body

  pool.query(
    'UPDATE collections SET name = $1 WHERE collection_id = $2',
    [name, id],
    (error: any, results: any) => {
      if (error) {
        return response.status(400).json(error.message)
      }
      response.status(200).send(`Collection modified with ID: ${id}`)
    }
  )
}

const deleteCollection = (request: Request, response: Response) => {
  const id = request.params.id

  pool.query('DELETE FROM collections WHERE collection_id = $1', [id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).send(`Collection deleted with ID: ${id}`)
  })
}

export default {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
}

