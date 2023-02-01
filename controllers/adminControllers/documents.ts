import { Request, Response} from 'express';
import { DocumentData } from 'interfaces';
import DocumentDbServices from '../../dbServices/documents';


const getDocuments = async (request: Request, response: Response) => {
  try {
    let allDocuments = await DocumentDbServices.getAllDocuments();
    return response.status(200).json({
      message: [`Documents fetched SuccessFully`],
      status: "success",
      statusCode: 200,
      payload: allDocuments
    })
  } 
  catch (error: any) {
    return response.status(400).json({message: error.message})
  } 
}

const getDocumentById = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let document = await DocumentDbServices.getDocumentById(id);
    if(document){
      return response.status(200).json({
        message: [`Document fetched SuccessFully`],
        status: "success",
        statusCode: 200,
        payload: document
      })
    }
    return response.status(404).json({message: "Document Not Found"})
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const createDocument = async (request: Request, response: Response) => {
  const { user_id, collection_id, cluster_id, collection_name, data } = request.body;

  try {
    let document = await DocumentDbServices.createDocument({ user_id, collection_id, cluster_id, collection_name, data })
    if(document){
      return response.status(201).json({
        message: [`Document created SuccessFully`],
        status: "success",
        statusCode: 201,
        payload: document
      })
    }
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const updateDocument = async (request: Request, response: Response) => {
  const id = request.params.id;
  let newDocument: DocumentData = request.body;

  try {
    let oldDocument: any = await DocumentDbServices.getDocumentById(id);
    if(!oldDocument){
      return response.status(400).send(`Document with ID:${id} does not exist`)
    }
    let newData = { ...oldDocument.data, ...newDocument.data}
    let document = await DocumentDbServices.updateDocument(id, newData)
    if(document){
      return response.status(201).json({
        message: [`Document updated SuccessFully`],
        status: "success",
        statusCode: 200,
        payload: document
      })
    }
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const deleteDocument = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let documentId = await DocumentDbServices.deleteDocument(id)
    return response.status(200).send({
      message: [`Document deleted with ID: ${documentId}`],
      status: "success",
      statusCode: 200,
      payload: null
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

export default {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
}

