import express, { Express, Request, Response} from 'express';
import clusters from './queries/clusters';
import users from './queries/users';
import collections from './queries/collections';
import documents from './queries/documents';
import bodyParser from 'body-parser';
import userQueries from './queries/userQueries/crudData.query';
import config from './config';
import cors from 'cors';
import { deleteOneData, postData, readAllData, readOneData, updateOneData } from './userControllers/crudData.controller';



const app: Express = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())



app.get('/clusters', clusters.getClusters)
app.get('/clusters/:id', clusters.getClusterById)
app.post('/clusters/create', clusters.createCluster)
app.put('/clusters/:id', clusters.updateCluster)
app.patch('/clusters/freeze/:id', clusters.deActivateCluster)
app.patch('/clusters/unfreeze/:id', clusters.reActivateCluster)
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


app.post('/:apiKey/:collectionName/create', postData);
app.get('/:apiKey/:collectionName/read', readAllData);
app.get('/:apiKey/:collectionName/read/:documentId', readOneData);
app.patch('/:apiKey/:collectionName/update/:documentId', updateOneData);
app.delete('/:apiKey/:collectionName/delete/:documentId', deleteOneData);



export default app;
