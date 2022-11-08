import express, { Express, Request, Response} from 'express';
import clusters from './controllers/adminControllers/clusters';
import users from './controllers/adminControllers/users';
import collections from './controllers/adminControllers/collections';
import documents from './controllers/adminControllers/documents';
import bodyParser from 'body-parser';
import userQueries from './controllers/userControllers/crudData.query';
import config from './config';
import cors from 'cors';
import { deleteOneData, postData, readAllData, readOneData, updateOneData } from './controllers/userControllers/crudData.controller';
import { postDocument } from './controllers/userControllers/postDocument';


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

app.get('/clusters', clusters.getClusters)
app.get('/clusters/:id', clusters.getClusterById)
app.post('/clusters/create', clusters.createCluster)
app.put('/clusters/:id', clusters.updateCluster)
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


app.post('/:apiKey/:collectionName/create', postDocument);
app.get('/:apiKey/:collectionName/read', readAllData);
app.get('/:apiKey/:collectionName/read/:documentId', readOneData);
app.post('/:apiKey/:collectionName/update/:documentId', updateOneData);
app.delete('/:apiKey/:collectionName/delete/:documentId', deleteOneData);



export default app;
