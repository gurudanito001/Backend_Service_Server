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
    return res.status(400).json({message: "apiKey is not valid"})
  }
  if(!isValidDocumentId){
    return res.status(400).json({message: "documentId is not valid"})
  }

  try {
    // Database validations
    let clusterExists = await ClusterDbServices.clusterExists(apiKey);
    if(!clusterExists){
      return res.status(404).json({message: "Cluster does not exist"})
    }
    let collectionExists = await CollectionDbServices.customCollectionExists("cluster_id = $1 AND name = $2 ", {apiKey, collectionName});
    if(!collectionExists){
      return res.status(404).json({message: "Collection does not exist"})
    }
    let deletedDocumentId = await DocumentDbServices.deleteDocument(documentId);
    return res.status(200).json({
      message: [`Document deleted with id: ${deletedDocumentId}`],
      status: "success",
      statusCode: 200,
      payload: null
    })
  } catch (error: any) {
    return res.status(400).json({message: error.message})
  }
};