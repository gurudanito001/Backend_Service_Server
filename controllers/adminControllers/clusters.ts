import { Request, Response} from 'express';
import ClusterDbServices from '../../dbServices/clusters';
import bcrypt from 'bcrypt';
import { LoginCredentials } from 'interfaces';
import config from '../../config';
import  Jwt  from 'jsonwebtoken';
import { ClusterData } from 'interfaces';
import sendEmail from '../../services/sendEmail';


const getClusters = async (request: Request, response: Response) => {
  try {
    let allClusters = await ClusterDbServices.getAllClusters();
    return response.status(201).json(allClusters)
  } catch (error) {
    return response.status(400).json(error)
  } 
}

const Authenticate = async (request: Request, response: Response) => {
  const {email, password} = request.body;
  const cluster = await ClusterDbServices.getClusterByParams('email = $1', [email]) as LoginCredentials;
  if(!cluster){
    return response.status(404).json({message: "Invalid Login Credentials"})
  }
  const isValidPassword = await bcrypt.compare(password, cluster.password);
  if(!isValidPassword){
    return response.status(404).json({message: "Invalid Login Credentials"})
  }
  return response.status(201).json(cluster) 
}



const getClusterById = async (request: Request, response: Response) => {
  const clusterId = request.params.id;
  
  try {
    let cluster = await ClusterDbServices.getClusterById(clusterId);
    if(cluster){
      return response.status(201).json(cluster)
    }
    return response.status(404).json({error: "Cluster Not Found"})
  } catch (error) {
    return response.status(400).json(error)
  }
}

const createCluster = async (request: Request, response: Response) => {
  const { name, email, password, description, multi_tenant, test_string } = request.body;
  
  try {
    let hashedPassword = await bcrypt.hash(password, 7)
    let emailExists = await ClusterDbServices.valueExists("clusters", "email", email);
    if(emailExists){
      return response.status(400).send("Email Already Exists")
    }

    let cluster = await ClusterDbServices.createCluster({name, email, password: hashedPassword, description, multi_tenant}) as ClusterData
    if(cluster){
      if(test_string === config.TEST_STRING.toString()){
        return response.status(201).json(cluster)
      }
      let unSignedData = {email: cluster.email, cluster_id: cluster.cluster_id}
      const token = Jwt.sign(unSignedData, config.SECRET, {
        expiresIn: "900000" //15mins
      });
      sendEmail(cluster.email, `http://localhost:8080/confirmEmail/${token}`)
      .then(res =>{
        return response.status(201).json({
          messages: [res.message],
          status: "success",
          statusCode: 201,
          payload: cluster
        })
      })
    }

  } catch (error) {
    return response.status(400).json({error})
  }
}

const updateCluster = async (request: Request, response: Response) => {
  const id = request.params.id
  const { name, email, password, description, multi_tenant } = request.body;

  try {
    let cluster = await ClusterDbServices.updateCluster(id, {name, email, password, description, multi_tenant})
    if(cluster){
      return response.status(201).json(cluster)
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

const deActivateCluster = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let cluster = await ClusterDbServices.deActivateCluster(id)
    return response.status(200).json(cluster)
  } catch (error) {
    return response.status(400).json(error)
  }
}

const reActivateCluster = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let cluster = await ClusterDbServices.reActivateCluster(id)
    return response.status(200).json(cluster)
  } catch (error) {
    return response.status(400).json(error)
  }
}

const deleteCluster = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let clusterId = await ClusterDbServices.deleteCluster(id)
    return response.status(200).json({message: `Cluster deleted with ID: ${clusterId}`})
  } catch (error) {
    return response.status(400).json(error)
  }
}



export default {
  getClusters,
  getClusterById,
  createCluster,
  Authenticate,
  updateCluster,
  deActivateCluster,
  reActivateCluster,
  deleteCluster,
}

