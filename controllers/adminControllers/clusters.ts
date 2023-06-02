import { Request, Response} from 'express';
import ClusterDbServices from '../../dbServices/clusters';
import { ClusterData } from 'interfaces';
/* import bcrypt from 'bcrypt';
import config from '../../config';
import  Jwt  from 'jsonwebtoken';
import { ClusterData } from 'interfaces';
import sendEmail from '../../services/sendEmail'; */


const getClusters = async (request: Request, response: Response) => {
  try {
    let allClusters = await ClusterDbServices.getAllClusters();
    return response.status(200).json({
      message: ["Clusters Fetched Successfully"],
      status: "success",
      statusCode: 200,
      payload: allClusters
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  } 
}

const getClusterById = async (request: Request, response: Response) => {
  const clusterId = request.params.id;
  
  try {
    let cluster = await ClusterDbServices.getClusterById(clusterId);
    if(cluster){
      return response.status(200).json({
        message: ["Cluster Fetched Successfully"],
        status: "success",
        statusCode: 200,
        payload: cluster
      })
    }
    return response.status(404).json({message: "Cluster Not Found"})
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const updateCluster = async (request: Request, response: Response) => {
  const id = request.params.id
  const newData = request.body;

  try {
    let clusterData = await ClusterDbServices.getClusterById(id) as ClusterData;
    let cluster = await ClusterDbServices.updateCluster(id, {...clusterData, ...newData})
    if(cluster){
      return response.status(200).json({
        message: ["Cluster Updated Successfully"],
        status: "success",
        statusCode: 200,
        payload: cluster
      })
    }
  } catch (error: any) {
    return response.status(400).json({message: error})
  }
}

const deActivateCluster = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let cluster = await ClusterDbServices.deActivateCluster(id)
    return response.status(200).json({
      message: ["Cluster Deactivated Successfully"],
      status: "success",
      statusCode: 200,
      payload: cluster
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const reActivateCluster = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let cluster = await ClusterDbServices.reActivateCluster(id)
    return response.status(200).json({
      message: ["Cluster Reactivated Successfully"],
      status: "success",
      statusCode: 200,
      payload: cluster
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const deleteCluster = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let clusterId = await ClusterDbServices.deleteCluster(id)
    return response.status(200).json({
      message: [`Cluster deleted with ID: ${clusterId}`],
      status: "success",
      statusCode: 200,
      payload: null
    })
  } catch (error) {
    return response.status(400).json(error)
  }
}



export default {
  getClusters,
  getClusterById,
  updateCluster,
  deActivateCluster,
  reActivateCluster,
  deleteCluster,
}

