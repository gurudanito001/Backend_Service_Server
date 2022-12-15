import { Request, Response } from "express";
import DocumentDbServices from '../../dbServices/documents';
import CollectionDbServices from '../../dbServices/collections';
import ClusterDbServices from '../../dbServices/clusters';
import { DocumentData } from "interfaces";
import validator from "validator";

export const updateOneDocument = async (req: Request, res: Response) => {

  const { apiKey, collectionName, documentId } = req.params;
  const data = req.body;
  const isValidApiKey = validator.isUUID(apiKey, 4);
  const isValidDocumentId = validator.isUUID(documentId, 4);

  //validate Data. Make sure data types are correct.
  if( !(typeof(data) === "object" && !Array.isArray(data)) ){
    return res.status(400).json({error: "Data must be an object"})
  }
  if(Object.keys(data).length === 0){
    return res.status(400).json({error: "Data must not be empty"})
  }
  if(!isValidApiKey){
    return res.status(400).json({error: "apiKey is not valid"})
  }
  if(!isValidDocumentId){
    return res.status(400).json({error: "documentId is not valid"})
  }

  try {
    // Database validations
    let clusterExists = await ClusterDbServices.clusterExists(apiKey);
    if(!clusterExists){
      return res.status(404).json({error: "Cluster does not exist"})
    }
    let collectionExists = await CollectionDbServices.customCollectionExists("cluster_id = $1 AND name = $2 ", {apiKey, collectionName});
    if(!collectionExists){
      return res.status(404).json({error: "Collection does not exist"})
    }
    let document = await DocumentDbServices.getOneDocumentByParams("cluster_id = $1 AND collection_name = $2 AND document_id = $3", {apiKey, collectionName, documentId}) as DocumentData;
    if(!document){
      return res.status(404).json({error: "Document does not exist"})
    }

    let documentUpdate = { ...document.data, ...data}
    let updatedDocument = await DocumentDbServices.updateDocument(documentId, documentUpdate) as DocumentData;

    return res.status(201).json({
      messages: ['Document updated'],
      status: "success",
      statusCode: 201,
      payload: updatedDocument
    })
  } catch (error) {
    return res.status(400).json({error})
  }
};