import { Request, Response} from 'express';
import CollectionDbServices from '../../dbServices/collections';


const getCollections = async (request: Request, response: Response) => {
  try {
    let allCollections = await CollectionDbServices.getAllCollections();
    return response.status(201).json(allCollections)
  } 
  catch (error) {
    return response.status(400).json(error)
  } 
}

const getCollectionById = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let collection = await CollectionDbServices.getCollectionById(id);
    if(collection){
      return response.status(201).json(collection)
    }
    return response.status(404).json({error: "Collection Not Found"})
  } catch (error) {
    return response.status(400).json(error)
  }
}

const createCollection = async (request: Request, response: Response) => {
  const { cluster_id, name } = request.body;

  try {
    let collection = await CollectionDbServices.createCollection({cluster_id, name})
    if(collection){
      return response.status(201).json(collection)
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

const updateCollection = async (request: Request, response: Response) => {
  const id = request.params.id;
  const { name, cluster_id } = request.body;

  try {
    let collection = await CollectionDbServices.updateCollection(id, {name, cluster_id })
    if(collection){
      return response.status(201).json(collection)
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

const deleteCollection = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let collectionId = await CollectionDbServices.deleteCollection(id)
    return response.status(200).send({message: `Collection deleted with ID: ${collectionId}`})
  } catch (error) {
    return response.status(400).json(error)
  }
}

export default {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
}

