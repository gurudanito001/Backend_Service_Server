import { Request, Response} from 'express';
import pool from '../dbConnection'


const getUsers = (request: Request, response: Response) => {
  pool.query('SELECT * FROM users', (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request: Request, response: Response) => {
  const user_id = request.params.id;

  pool.query('SELECT * FROM users WHERE user_id = $1', [user_id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).json(results.rows[0])
  })
}

const createUser = (request: Request, response: Response) => {
  const { cluster_id, data } = request.body;
  
  pool.query('INSERT INTO users (cluster_id, data) VALUES ($1, $2) RETURNING cluster_id, user_id, data', [cluster_id, data], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(201).send(results.rows[0])
  })
}

const updateUser = (request: Request, response: Response) => {
  const id = request.params.id
  const { data } = request.body

  pool.query(
    'UPDATE users SET data = $1 WHERE user_id = $2 RETURNING user_id, cluster_id, data',
    [data, id],
    (error: any, results: any) => {
      if (error) {
        return response.status(400).json(error.message)
      }
      response.status(201).send(results.rows[0])
    }
  )
}

const deleteUser = (request: Request, response: Response) => {
  const id = request.params.id

  pool.query('DELETE FROM users WHERE user_id = $1', [id], (error: any, results: any) => {
    if (error) {
      return response.status(400).json(error.message)
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

