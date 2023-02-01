import { Request, Response} from 'express';
import CollectionDbServices from '../../dbServices/collections';


const getCollections = async (request: Request, response: Response) => {
  try {
    let allCollections = await CollectionDbServices.getAllCollections();
    return response.status(200).json({
      message: [`Collections fetched SuccessFully`],
      status: "success",
      statusCode: 200,
      payload: allCollections
    })
  } 
  catch (error: any) {
    return response.status(400).json({message: error.message})
  } 
}

const getCollectionById = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let collection = await CollectionDbServices.getCollectionById(id);
    if(collection){
      return response.status(200).json({
        message: [`Collection fetched SuccessFully`],
        status: "success",
        statusCode: 200,
        payload: collection
      })
    }
    return response.status(404).json({message: "Collection Not Found"})
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const createCollection = async (request: Request, response: Response) => {
  const { cluster_id, name } = request.body;

  try {
    let collection = await CollectionDbServices.createCollection({cluster_id, name})
    if(collection){
      return response.status(201).json({
        message: [`Collection created SuccessFully`],
        status: "success",
        statusCode: 201,
        payload: collection
      })
    }
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const updateCollection = async (request: Request, response: Response) => {
  const id = request.params.id;
  const { name, cluster_id } = request.body;

  try {
    let collection = await CollectionDbServices.updateCollection(id, {name, cluster_id })
    if(collection){
      return response.status(200).json({
        message: [`Collection updated SuccessFully`],
        status: "success",
        statusCode: 200,
        payload: collection
      })
    }
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const deleteCollection = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let collectionId = await CollectionDbServices.deleteCollection(id)
    return response.status(200).send({
      message: [`Collection deleted with ID: ${collectionId}`],
      status: "success",
      statusCode: 200,
      payload: null
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

export default {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
}

