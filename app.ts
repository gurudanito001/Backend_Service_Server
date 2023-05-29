import express, { Express, Request, Response} from 'express';
import clusters from './controllers/adminControllers/clusters';
import users from './controllers/adminControllers/users';
import collections from './controllers/adminControllers/collections';
import documents from './controllers/adminControllers/documents';
import bodyParser from 'body-parser';
import config from './config';
import cors from 'cors';
import { postDocument } from './controllers/serviceClientControllers/postDocument';
import { readOneDocument } from './controllers/serviceClientControllers/readOneDocument';
import { readAllDocuments } from './controllers/serviceClientControllers/readAllDocuments';
import { updateOneDocument } from './controllers/serviceClientControllers/updateOneDocument';
import { deleteOneDocument } from './controllers/serviceClientControllers/deleteOneDocument';
import { getAllUsers } from './controllers/serviceClientControllers/getAllUsers';
import { getUserById } from './controllers/serviceClientControllers/getUserById';
import { authenticateCluster, registerCluster ,confirmClusterEmail, resetClusterPassword, changeClusterPassword, resendClusterVerificationLink } from './controllers/adminControllers/authControllers';
import { confirmUserEmail, changeUserPassword, resetUserPassword, registerUser, authenticateUser, resendVerificationLink } from './controllers/serviceClientControllers/authControllers';


const app: Express = express();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.setHeader('Access-Control-Allow-Credentials', '*');
  next();
});

app.get('/', (req, res)=>{
  res.send("Marlayer Backend Service App")
})

// ADMIN ENDPOINTS 
//app.post('/sendEmail', sendAnEmail);
app.post('/clusters/register', registerCluster);
app.post('/clusters/login', authenticateCluster);
app.get('/clusters/confirmEmail/:token', confirmClusterEmail);
app.post('/clusters/resendVerificationLink/:email', resendClusterVerificationLink);
app.post('/clusters/resetPassword/', resetClusterPassword); 
app.post('/clusters/changePassword/:token', changeClusterPassword);

app.get('/clusters', clusters.getClusters);
app.get('/clusters/:id', clusters.getClusterById);
app.put('/clusters/:id', clusters.updateCluster);
app.post('/clusters/freeze/:id', clusters.deActivateCluster);
app.post('/clusters/unfreeze/:id', clusters.reActivateCluster);
app.delete('/clusters/:id', clusters.deleteCluster);

app.post('/collections/create', collections.createCollection)
app.get('/collections', collections.getCollections)
app.get('/collections/:id', collections.getCollectionById)
app.put('/collections/:id', collections.updateCollection)
app.delete('/collections/:id', collections.deleteCollection)

app.post('/users/create', users.createUser)
app.get('/users', users.getUsers)
app.get('/users/:id', users.getUserById)
app.put('/users/:id', users.updateUser)
app.delete('/users/:id', users.deleteUser)

app.get('/userStructures', users.getStructures)
app.get('/userStructures/:id', users.getStructureByClusterId)
app.delete('/userStructures/:id', users.deleteStructure)

app.get('/documents', documents.getDocuments)
app.get('/documents/:id', documents.getDocumentById)
app.post('/documents/create', documents.createDocument)
app.put('/documents/:id', documents.updateDocument)
app.delete('/documents/:id', documents.deleteDocument)



//SERVICE USER ENDPOINTS

//auth endpoints
app.post('/api/v1/users/register', registerUser);
app.post('/api/v1/users/login', authenticateUser);
app.get('/api/v1/users/confirmEmail/:token', confirmUserEmail);
app.post('/api/v1/users/resendVerificationLink/:email', resendVerificationLink);
app.post('/api/v1/users/resetPassword', resetUserPassword);
app.post('/api/v1/users/changePassword/:token', changeUserPassword);

// crud endpoints users
// get all users
app.get('/api/v1/:apiKey/users', getAllUsers);
// get one user
app.get('/api/v1/users/:userId', getUserById);
// update one user 
app.post('/api/v1/users/:userId', getUserById);
// delete one user




// crud endpoints documents
app.post('/api/v1/:apiKey/:collectionName', postDocument);
app.get('/api/v1/:apiKey/:collectionName/:documentId', readOneDocument);
app.get('/api/v1/:apiKey/:collectionName', readAllDocuments);
app.post('/api/v1/:apiKey/:collectionName/:documentId', updateOneDocument);
app.delete('/api/v1/:apiKey/:collectionName/:documentId', deleteOneDocument);



export default app;
