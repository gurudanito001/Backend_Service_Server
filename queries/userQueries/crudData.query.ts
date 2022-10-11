import pool from '../../dbConnection';
import ServerError from '../../services/errorService';
import {deleteOneDataObject, PostDataObject, ReadDataObject, ReadOneDataObject, UpdateOneDataObject} from '../../interfaces'
import cluster from 'cluster';



async function postData (postData: PostDataObject){
  const {apiKey, collection_name, data, env} = postData;
  let createCollectionResult;
  let collection_id;
  let newCollectionCreated = false;
  
  // check if there is a cluster with cluster_id of apiKey
  let clusterQueryResult = await pool.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
  if(!clusterQueryResult.rows[0].exists){
    throw new ServerError(["Cluster does not exist"], 404);
  }

  // check if collection exists with apiKey as cluster_id and name as collectionName
  let collectionQueryResult = await pool.query('SELECT * FROM collections WHERE cluster_id = $1 AND name = $2', [apiKey, collection_name]);
  if(collectionQueryResult.rows.length === 0){
    // create new collection with cluster_id and name
    createCollectionResult = await pool.query('INSERT INTO collections (cluster_id, name) VALUES ($1, $2)  RETURNING collection_id', [apiKey, collection_name]);
    collection_id = createCollectionResult.rows[0].collection_id
    newCollectionCreated = true;
  }else{
    collection_id = collectionQueryResult.rows[0].collection_id
  }

  // create new document with cluster_id, collection_id and data
  let createDocumentResult = await pool.query('INSERT INTO documents (cluster_id, collection_id, collection_name, data) VALUES ($1, $2, $3, $4) RETURNING document_id, cluster_id, collection_id, collection_name, data', [apiKey, collection_id, collection_name, data]);

  if(!createDocumentResult.rows[0].document_id){
    throw new Error("Unable to create document")
  }

  let successMessages = [];
  successMessages.push("New document created");
  newCollectionCreated && successMessages.push("New collection created");
  return {
    messages: successMessages,
    status: "success",
    statusCode: 201,
    payload: createDocumentResult.rows[0]
  }
}

async function readAllData(readAllData: ReadDataObject ) {
  let {apiKey, collection_name} = readAllData;

  let documentQueryResult = await pool.query('SELECT * FROM documents WHERE cluster_id = $1 AND collection_name = $2', [apiKey, collection_name]);

  if(!Boolean(documentQueryResult.rows.length)){
    let clusterQueryResult = await pool.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
    if(!clusterQueryResult.rows[0].exists){
      throw new Error("Cluster does not exist");
    }
    let collectionQueryResult = await pool.query('select exists(SELECT * FROM collections WHERE cluster_id = $1 AND name = $2)', [apiKey, collection_name]);
    if(!collectionQueryResult.rows[0].exists){
      throw new Error("Collection does not exist");
    }
    throw new Error("No Document Found in this collection");
  }else{
    return {
      messages: ["Data Fetched successfully"],
      status: "success",
      statusCode: 201,
      payload: documentQueryResult.rows
    }
  }
}

async function readOneData(readOneData: ReadOneDataObject ) {
  let {apiKey, collection_name, document_id} = readOneData;
  const clusterId = apiKey;

  let documentQueryResult = await pool.query('SELECT * FROM documents WHERE cluster_id = $1 AND collection_name = $2 AND document_id = $3', [apiKey, collection_name, document_id]);

  if(!Boolean(documentQueryResult?.rows?.length)){ //to be true length has to be 0
    let clusterQueryResult = await pool.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
    if(!clusterQueryResult.rows[0].exists){
      throw new Error("Cluster does not exist");
    }
    let collectionQueryResult = await pool.query('select exists(SELECT * FROM collections WHERE cluster_id = $1 AND name = $2)', [apiKey, collection_name]);
    if(!collectionQueryResult.rows[0].exists){
      throw new Error("Collection does not exist");
    }
    throw new Error("Document does not exist");
  }else{
    return {
      messages: ["Data Fetched successfully"],
      status: "success",
      statusCode: 201,
      payload: documentQueryResult.rows[0]
    }
  }
}

async function updateOneData(updateOneData: UpdateOneDataObject ) {
  let {apiKey, collection_name, document_id, data} = updateOneData;
  
  let documentQueryResult = await pool.query('SELECT * FROM documents WHERE cluster_id = $1 AND collection_name = $2 AND document_id = $3', [apiKey, collection_name, document_id]);

  if(!Boolean(documentQueryResult?.rows?.length)){
    let clusterQueryResult = await pool.query('select exists(SELECT * FROM clusters WHERE cluster_id = $1)', [apiKey]);
    if(!clusterQueryResult.rows[0].exists){
      throw new Error("Cluster does not exist");
    }
    let collectionQueryResult = await pool.query('select exists(SELECT * FROM collections WHERE cluster_id = $1 AND name = $2)', [apiKey, collection_name]);
    if(!collectionQueryResult.rows[0].exists){
      throw new Error("Collection does not exist");
    }
    throw new Error("Document does not exist");
  }else{
    let newData = { ...documentQueryResult.rows[0].data, ...data}

    let updatedDocument = await pool.query(
      'UPDATE documents SET data = $1 WHERE document_id = $2 AND cluster_id = $3 AND collection_name = $4 RETURNING *',
      [newData, document_id, apiKey, collection_name]) 
  
    return {
      messages: ['Document updated'],
      status: "success",
      statusCode: 201,
      payload: updatedDocument.rows
    }
  }
}

async function deleteOneData(deleteOneData: deleteOneDataObject) {
  const { apiKey, collection_name, document_id } = deleteOneData;
  
  let deletedData = await pool.query('DELETE FROM documents WHERE document_id = $1 AND cluster_id = $2 AND collection_name = $3 RETURNING document_id', [document_id, apiKey, collection_name])

  if(!deletedData?.rows){
    throw new Error("Error deleting document");
  }

  return {
    messages: [`Document deleted with id: ${document_id}`],
    status: "success",
    statusCode: 201,
    payload: deletedData.rows[0]
  } 
}



export default {
  postData,
  readAllData,
  readOneData,
  updateOneData,
  deleteOneData
}