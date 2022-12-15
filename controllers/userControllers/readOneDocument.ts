import { Request, Response } from "express";
import DocumentDbServices from '../../dbServices/documents';
import CollectionDbServices from '../../dbServices/collections';
import ClusterDbServices from '../../dbServices/clusters';
import { DocumentData } from "interfaces";
import validator from "validator";

export const readOneDocument = async (req: Request, res: Response) => {

  const {apiKey, collectionName, documentId} = req.params;
  let result = {
    isValidApiKey: validator.isUUID(apiKey, 4),
    isValidDocumentId: validator.isUUID(documentId, 4),
  }
  if(!result.isValidApiKey){
    return res.status(400).json({error: "apiKey is not valid"})
  }else if(!result.isValidDocumentId){
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
      return res.status(404).json({error: "Document Not found"})
    }
    return res.status(201).json({
      messages: ['Data retreived successfully'],
      status: "success",
      statusCode: 201,
      payload: document
    })
  } catch (error) {
    return res.status(400).json({error})
  }
}