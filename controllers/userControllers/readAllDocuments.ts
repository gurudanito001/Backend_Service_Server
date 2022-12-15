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
    return res.status(400).json({error: "apiKey is not valid"})
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

    let documents = await DocumentDbServices.getAllDocumentsByParams("cluster_id = $1 AND collection_name = $2", {apiKey, collectionName}) as DocumentData[];
    if(!documents){
      return res.status(404).json({error: "Documents Not found"})
    }
    return res.status(201).json({
      messages: ['Data retreived successfully'],
      status: "success",
      statusCode: 201,
      payload: documents
    })
  } catch (error) {
    return res.status(400).json({error})
  }
}