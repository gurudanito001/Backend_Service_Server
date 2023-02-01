import { Request, Response } from "express";
import DocumentDbServices from '../../dbServices/documents';
import CollectionDbServices from '../../dbServices/collections';
import ClusterDbServices from '../../dbServices/clusters';
import { DocumentData, CollectionData } from "../../interfaces";
import validator from "validator";
import { doesDataMatchStructure } from "../../services/doesDataMatchStructure";

export const updateOneDocument = async (req: Request, res: Response) => {

  const { apiKey, collectionName, documentId } = req.params;
  const data = req.body;
  const isValidApiKey = validator.isUUID(apiKey, 4);
  const isValidDocumentId = validator.isUUID(documentId, 4);

  //validate Data. Make sure data types are correct.
  if( !(typeof(data) === "object" && !Array.isArray(data)) ){
    return res.status(400).json({message: "Data must be an object"})
  }
  if(Object.keys(data).length === 0){
    return res.status(400).json({message: "Data must not be empty"})
  }
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
    let collection = await CollectionDbServices.customGetCollection('cluster_id = $1 AND name = $2', [apiKey, collectionName.toLocaleLowerCase()]) as CollectionData;
    if(!collection){
      return res.status(404).json({message: "Collection does not exist"})
    }
    let dataMatchesCollection = doesDataMatchStructure(data, collection.structure);
    if(!dataMatchesCollection){
      return res.status(400).json({message: `Data does not match '${collectionName}' structure`})
    }
    let document = await DocumentDbServices.getOneDocumentByParams("cluster_id = $1 AND collection_name = $2 AND document_id = $3", {apiKey, collectionName, documentId}) as DocumentData;
    if(!document){
      return res.status(404).json({message: "Document does not exist"})
    }

    let documentUpdate = { ...document.data, ...data}
    let updatedDocument = await DocumentDbServices.updateDocument(documentId, documentUpdate) as DocumentData;

    return res.status(201).json({
      message: ['Document updated successfully'],
      status: "success",
      statusCode: 201,
      payload: updatedDocument
    })
  } catch (error: any) {
    return res.status(400).json({message: error.message})
  }
};