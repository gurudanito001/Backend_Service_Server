import { Request, Response } from "express";
import DocumentDbServices from '../../dbServices/documents';
import CollectionDbServices from '../../dbServices/collections';
import ClusterDbServices from '../../dbServices/clusters';
import { DocumentData } from "interfaces";
import validator from "validator";

export const deleteOneDocument = async (req: Request, res: Response) => {

  const { apiKey, collectionName, documentId } = req.params;
  const data = req.body;
  const isValidApiKey = validator.isUUID(apiKey, 4);
  const isValidDocumentId = validator.isUUID(documentId, 4);

  //validate Data. Make sure data types are correct.
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
    let deletedDocumentId = await DocumentDbServices.deleteDocument(documentId) ;
    return res.status(200).json({
      messages: [`Document deleted with id: ${deletedDocumentId}`],
      status: "success",
      statusCode: 201,
      payload: null
    })
  } catch (error) {
    return res.status(400).json({error})
  }
};