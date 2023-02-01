import { Request, Response } from "express";
import DocumentDbServices from '../../dbServices/documents';
import CollectionDbServices from '../../dbServices/collections';
import ClusterDbServices from '../../dbServices/clusters';
import { DocumentData } from "interfaces";
import validator from "validator";

export const readAllDocuments = async (req: Request, res: Response) => {

  const {apiKey, collectionName} = req.params;
  const isValidApiKey = validator.isUUID(apiKey, 4);

  if(!isValidApiKey){
    return res.status(400).json({message: "apiKey is not valid"})
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

    let documents = await DocumentDbServices.getAllDocumentsByParams("cluster_id = $1 AND collection_name = $2", {apiKey, collectionName}) as DocumentData[];
    if(!documents){
      return res.status(404).json({message: "Documents Not found"})
    }
    return res.status(200).json({
      message: ['Data fetched successfully'],
      status: "success",
      statusCode: 200,
      payload: documents
    })
  } catch (error: any) {
    return res.status(400).json({message: error.message})
  }
}