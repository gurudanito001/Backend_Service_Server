import sendEmail from "../../services/sendEmail";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import ClusterDbServices from '../../dbServices/clusters';
import { ClusterData } from '../../interfaces';
import validator from "validator";



interface TokenData{
  email: string,
  cluster_id: string
}

export const registerCluster = async (request: Request, response: Response) => {
  const { name, email, password, description, multi_tenant, test_string } = request.body;
  
  if(!email || !password){
    return response.status(400).send({message: "Email and Password fields are required"})
  }
  if(!validator.isEmail(email)){
    return response.status(400).send({message: "Email is not valid"})
  }
  if(validator.isEmpty(password)){
    return response.status(400).send({message: "Password is required"})
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 7)
    let emailExists = await ClusterDbServices.valueExists("clusters", "email", email);
    if(emailExists){
      return response.status(400).send({message: "Email Already Exists"})
    }

    let cluster = await ClusterDbServices.createCluster({name, email, password: hashedPassword, description, multi_tenant}) as ClusterData
    if(cluster){
      let unSignedData = {email: cluster.email, cluster_id: cluster.cluster_id}
      const token = jwt.sign(unSignedData, config.SECRET, {
        expiresIn: "900000" //15mins
      });
      if(test_string === config.TEST_STRING.toString()){
        return response.status(201).json({
          message: [`Cluster created successfully`],
          status: "success",
          statusCode: 200,
          payload: cluster,
          token: token
        })
      }
      
      sendEmail({email: cluster.email, url: `${config.API_BASE_URL}/clusters/confirmEmail/${token}` })
      .then(res =>{
        return response.status(200).json({
          message: [res.message],
          status: "success",
          statusCode: 200,
          payload: cluster
        })
      })
    }

  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

export const authenticateCluster = async (request: Request, response: Response) => {
  const {email, password} = request.body;
  try {
    const cluster = await ClusterDbServices.getClusterByParams('email = $1', [email]) as ClusterData;
    if(!cluster){
      return response.status(404).json({message: "Invalid Email or Password"})
    }
    const isValidPassword = await bcrypt.compare(password, cluster.password);
    if(!isValidPassword){
      return response.status(404).json({message: "Invalid Email or Password"})
    }
    if(!cluster.email_confirmed){
      return response.status(400).json({message: "Email not verified"})
    }
    return response.status(201).json({
      message: [`Login Successful`],
      status: "success",
      statusCode: 200,
      payload: cluster
    }) 
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}

export const confirmClusterEmail = async (request: Request, response: Response) =>{
  const {token} = request.params;
  try {
    let {cluster_id, email} = jwt.verify(token, config.SECRET) as TokenData;
    let clusterExists = await ClusterDbServices.clusterExists(cluster_id);
    if(!clusterExists){
      return response.status(404).json({message: "Cluster does not exist"})
    }
    let clusterData = await ClusterDbServices.verifyEmail(cluster_id, email)
    if(clusterData){
      return response.status(201).json({
        message: ["Email Confirmed Successfully"],
        status: "success",
        statusCode: 200,
        payload: null
      })
    }
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}

export const resendVerificationLink = async (request: Request, response: Response) => {
  let {email} = request.params;
  
  if(!validator.isEmail(email)){
    return response.status(400).send({message: "Email is not valid"})
  }

  try {
    let cluster = await ClusterDbServices.getClusterByParams('email = $1', [email]) as ClusterData;
    if(!cluster){
      return response.status(404).send({message: "Cluster does not exist"})
    }
    if(cluster.email_confirmed){
      return response.status(400).send({message: "Cluster email already verified"})
    }

    let unSignedData = { email: email, cluster_id: cluster.cluster_id }
    const token = jwt.sign(unSignedData, config.SECRET, {
      expiresIn: "900000" //15mins
    });
    sendEmail({email, url: `${config.API_BASE_URL}/api/v1/users/confirmEmail/${token}`})
      .then(res => {
        return response.status(201).json({
          message: ['A verification link has been resent to your email. Link expires in 15mins'],
          status: "success",
          statusCode: 200,
          payload: null
        })
      })
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}

export const resetClusterPassword = async (request: Request, response: Response) =>{
  const {email} = request.body;
  
  try {
    let emailExists = await ClusterDbServices.valueExists("clusters", "email", email);
    if(!emailExists){
      return response.status(400).send({message: "Email does not exist"})
    }
    let token = jwt.sign({email}, config.SECRET, {expiresIn: "900000"})
    sendEmail({email, url: `${config.API_BASE_URL}/clusters/changePassword/${token}`, message: "reset your password", buttonText: "Reset Password"})
      .then(res =>{
        return response.status(200).json({
          message: ['A reset link has been sent to your email. Link expires in 15mins'],
          status: "success",
          statusCode: 200,
          payload: null
        })
      })
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}

export const changeClusterPassword = async (request: Request, response: Response) =>{
  const {token} = request.params;
  const {newPassword} = request.body;
  
  try {
    let hashedPassword = await bcrypt.hash(newPassword, 7);
    let {email} = jwt.verify(token, config.SECRET) as TokenData;

    let clusterData = await ClusterDbServices.updateClusterByParams("password = $1", "email = $2", [hashedPassword, email])
    if(clusterData){
      return response.status(201).json({
        message: ["Password Reset Successful"],
        status: "success",
        statusCode: 201,
        payload: clusterData
      })
    }

  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}