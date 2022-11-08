import { Request, Response} from 'express';
import pool from '../../dbConnection'
import ClusterDbServices from '../../dbServices/clusters';


const getClusters = async (request: Request, response: Response) => {
  
  try {
    let allClusters = await ClusterDbServices.getAllClusters();
    return response.status(201).json(allClusters)
  } catch (error) {
    return response.status(400).json(error)
  } 
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
  const { name, email, password, description, multi_tenant } = request.body;

  try {
    let emailExists = await ClusterDbServices.valueExists("clusters", "email", email);
    if(emailExists){
      return response.status(400).send("Email Already Exists")
    }

    let cluster = await ClusterDbServices.createCluster({name, email, password, description, multi_tenant})
    if(cluster){
      return response.status(201).json(cluster)
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

const updateCluster = async (request: Request, response: Response) => {
  const id = request.params.id
  const { name, email, password, description, multi_tenant } = request.body;
  //const updated_at = Date.now().toString();

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
  const id = request.params.id

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
  updateCluster,
  deActivateCluster,
  reActivateCluster,
  deleteCluster,
}

