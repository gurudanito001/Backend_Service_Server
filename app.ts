import express, { Express, Request, Response} from 'express';
import clusters from './controllers/adminControllers/clusters';
import users from './controllers/adminControllers/users';
import collections from './controllers/adminControllers/collections';
import documents from './controllers/adminControllers/documents';
import bodyParser from 'body-parser';
import config from './config';
import cors from 'cors';
import { postDocument } from './controllers/userControllers/postDocument';
import { readOneDocument } from './controllers/userControllers/readOneDocument';
import { readAllDocuments } from './controllers/userControllers/readAllDocuments';
import { updateOneDocument } from './controllers/userControllers/updateOneDocument';
import { deleteOneDocument } from './controllers/userControllers/deleteOneDocument';
import { sendAnEmail, confirmEmail, resetPassword, changePassword } from './controllers/adminControllers/authControllers';
import {confirmUserEmail, changeUserPassword, resetUserPassword} from './controllers/userControllers/authControllers';


const app: Express = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.get('/hello', (req, res)=>{
  res.send("hello")
})

// ADMIN ENDPOINTS 
//app.post('/sendEmail', sendAnEmail);
app.get('/confirmEmail/:token', confirmEmail);
app.post('/resetPassword/', resetPassword); 
app.post('/changePassword/:token', changePassword);

app.get('/clusters', clusters.getClusters);
app.post('/clusters/login', clusters.Authenticate);
app.get('/clusters/:id', clusters.getClusterById);
app.post('/clusters/create', clusters.createCluster);
app.put('/clusters/:id', clusters.updateCluster);
app.post('/clusters/freeze/:id', clusters.deActivateCluster)
app.post('/clusters/unfreeze/:id', clusters.reActivateCluster)
app.delete('/clusters/:id', clusters.deleteCluster)

app.get('/collections', collections.getCollections)
app.get('/collections/:id', collections.getCollectionById)
app.post('/collections/create', collections.createCollection)
app.put('/collections/:id', collections.updateCollection)
app.delete('/collections/:id', collections.deleteCollection)

app.get('/users', users.getUsers)
app.get('/users/:id', users.getUserById)
app.post('/users/create', users.createUser)
app.put('/users/:id', users.updateUser)
app.delete('/users/:id', users.deleteUser)

app.get('/documents', documents.getDocuments)
app.get('/documents/:id', documents.getDocumentById)
app.post('/documents/create', documents.createDocument)
app.put('/documents/:id', documents.updateDocument)
app.delete('/documents/:id', documents.deleteDocument)



// USER ENDPOINTS
app.post('/api/v1/:apiKey/users/register', users.createUser);
app.get('/api/v1/users/confirmEmail/:token', confirmUserEmail);
app.post('/api/v1/users/resetPassword', resetUserPassword);
app.post('/api/v1/users/changePassword/:token', changeUserPassword);


app.post('/api/v1/:apiKey/:collectionName', postDocument);
app.get('/api/v1/:apiKey/:collectionName/:documentId', readOneDocument);
app.get('/api/v1/:apiKey/:collectionName', readAllDocuments);
app.post('/api/v1/:apiKey/:collectionName/:documentId', updateOneDocument);
app.delete('/api/v1/:apiKey/:collectionName/:documentId', deleteOneDocument);


export default app;
