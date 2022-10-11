import express, { Express, Request, Response} from 'express';
import userQueries from '../queries/userQueries/crudData.query';
import config from '../config';


export const postData = (req: Request, res: Response) => {

  const { apiKey, collectionName } = req.params;
  const data  = req.body;
  let postDataParams = {apiKey, collection_name: collectionName, data, env: config.env}
  let errors = [];
  if(Array.isArray(data)){
    errors.push("Data must be an object");
  }
  if(Object.keys(data).length === 0){
    errors.push("Data must not be empty");
  }
  if(errors.length > 0){
    return res.status(400).json({
      messages: ["Invalid value(s)"],
      status: "failed",
      statusCode: 400,
      errors: errors
    });
  }
  userQueries.postData(postDataParams)
  .then((data) => {
    return res.status(data.statusCode).json(data);
  })
  .catch((err) => {
    let error: any = {
      errors: err.errors,
      statusCode: err.statusCode,
      status: err.status,
      payload: err.payload
    }
    res.status(err.statusCode).json(error);
  });
};

export const readAllData = (req: Request, res: Response) => {

  const { apiKey, collectionName } = req.params;

  userQueries.readAllData({apiKey, collection_name: collectionName})
  .then((data) => {
    return res.status(data?.statusCode || 201).json(data);
  })
  .catch((err) => {
    let error: any = {
      errors: err.message,
      statusCode: 400,
      status: "failed",
      payload: null
    }
    res.status(400).json(error);
  });
};

export const readOneData = (req: Request, res: Response) => {

  const { apiKey, collectionName, documentId } = req.params;

  userQueries.readOneData({apiKey, collection_name: collectionName, document_id: documentId })
  .then((data) => {
    return res.status(data.statusCode).json(data);
  })
  .catch((err) => {
    let error: any = {
      errors: err.message,
      statusCode: 400,
      status: "failed",
      payload: null
    }
    res.status(400).json(error);
  });
 
};

export const updateOneData = (req: Request, res: Response) => {

  const { apiKey, collectionName, documentId } = req.params;
  const data = req.body;

  let errors = []
  if(Array.isArray(data)){
    errors.push("Data must be an object");
  }
  if(Object.keys(data).length === 0){
    errors.push("Data must not be empty");
  }
  if(errors.length > 0){
    return res.status(400).json({
      messages: ["Invalid value(s)"],
      status: "failed",
      statusCode: 400,
      errors: errors
    });
  }

  userQueries.updateOneData({apiKey, collection_name: collectionName, document_id: documentId, data })
  .then((data) => {
    console.log
    return res.status(201).json(data);
  })
  .catch((err) => {
    let error: any = {
      errors: err.message,
      statusCode: 400,
      status: "failed",
      payload: null
    }
    res.status(400).json(error);
  });
 
};


export const deleteOneData = (req: Request, res: Response) => {

  const { apiKey, collectionName, documentId } = req.params;

  userQueries.deleteOneData({apiKey, collection_name: collectionName, document_id: documentId })
  .then((data) => {
    return res.status(201).json(data);
  })
  .catch((err) => {
    let error: any = {
      errors: err.message,
      statusCode: 400,
      status: "failed",
      payload: null
    }
    res.status(400).json(error);
  });
 
};

