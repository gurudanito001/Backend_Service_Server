import  { Request, Response} from 'express';
import ClusterDbServices from '../../dbServices/clusters';
import CollectionDbServices from '../../dbServices/collections';
import DocumentDbServices from '../../dbServices/documents';
import { ClusterData, CollectionData } from 'interfaces';
import { DocumentData } from 'interfaces';
import validator from 'validator';
import structureGenerator from '../../services/generateDataStructure';



export const postDocument = async (request: Request, response: Response) => {

  let { apiKey, collectionName } = request.params;
  collectionName = collectionName.toLocaleLowerCase()
  const data = request.body;
  let newCollection: any;
  let collection_id: any;
  let newCollectionCreated = false;
  const isValidApiKey = validator.isUUID(apiKey, 4);


  //validate Data. Make sure data types are correct.
  if( !(typeof(data) === "object" && !Array.isArray(data)) ){
    return response.status(400).json({error: "data must be an object"})
  }
  if(Object.keys(data).length === 0){
    return response.status(400).json({error: "data must not be empty"})
  }
  if(!isValidApiKey){
    return response.status(400).json({error: "apiKey is not valid"})
  }


  try {
    /* Database Validations begin */
    // Check if cluster exists
    let cluster: ClusterData = await ClusterDbServices.getClusterById(apiKey) as ClusterData;
    if(!cluster){
      return response.status(400).json({error: "Cluster does not exist"})
    }
    // If Cluster is multi_tenant, user_id is required!!
    /* if(!cluster?.multi_tenant && !data.user_id){
      return response.status(400).json("user_id is required when multi_tenant=true in cluster")
    } */

    // Get Collection_Id if collection exists with collection_name and cluster_id
    let collection: CollectionData = await CollectionDbServices.customGetCollection('cluster_id = $1 AND name = $2', [apiKey, collectionName.toLocaleLowerCase()]) as CollectionData;
    
    if(!collection){
      // create new collection with cluster_id and name
      let dataStructure = structureGenerator(data);
      newCollection = await CollectionDbServices.createCollection({ cluster_id: apiKey, name: collectionName, structure: dataStructure }) as CollectionData
      collection_id = newCollection.collection_id
      newCollectionCreated = true;
    }else{
      collection_id = collection.collection_id
    }
    /* Database Validations end */

    // create new document with cluster_id, collection_id and data
    let newDocument: DocumentData  = await DocumentDbServices.createDocument({cluster_id: apiKey, collection_id, collection_name: collectionName, data }) as DocumentData

    let successMessages = [];
    successMessages.push("New document created");
    newCollectionCreated && successMessages.push("New collection created");
    return response.status(201).json({
      messages: successMessages,
      status: "success",
      statusCode: 201,
      payload: newDocument
    })

  } catch (error) {
    return response.status(400).send({error})
  }
};