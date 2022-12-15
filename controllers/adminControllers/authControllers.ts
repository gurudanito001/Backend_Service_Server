import sendEmail from "../../services/sendEmail";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import ClusterDbServices from '../../dbServices/clusters';



interface TokenData{
  email: string,
  cluster_id: string
}

export const sendAnEmail = async (request: Request, response: Response) =>{
  sendEmail(request.body.email, request.body.url)
  .then(res =>{
    return response.send(res)
  })
  .catch(error =>{
    response.send(error.message)
  })
}

export const confirmEmail = async (request: Request, response: Response) =>{
  const {token} = request.params;
  
  try {
    let {cluster_id, email} = jwt.verify(token, config.SECRET) as TokenData;
    let clusterData = await ClusterDbServices.verifyEmail(cluster_id, email)
    if(clusterData){
      return response.status(201).json({
        messages: ["Email Confirmed Successfully"],
        status: "success",
        statusCode: 200,
        payload: null
      })
    }
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}

export const resetPassword = async (request: Request, response: Response) =>{
  const {email} = request.body;
  
  try {
    let emailExists = await ClusterDbServices.valueExists("clusters", "email", email);
    if(!emailExists){
      return response.status(400).send({message: "Email does not exist"})
    }
    let token = jwt.sign({email}, config.SECRET, {expiresIn: "900000"})
    sendEmail(email, `http://localhost:8080/changePassword/${token}`, "reset your password")
      .then(res =>{
        return response.status(200).json({
          messages: ['A reset link has been sent to your email. Link expires in 15mins'],
          status: "success",
          statusCode: 200,
          payload: null
        })
      })
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}

export const changePassword = async (request: Request, response: Response) =>{
  const {token} = request.params;
  const {newPassword} = request.body;
  
  try {
    let hashedPassword = await bcrypt.hash(newPassword, 7);
    let {email} = jwt.verify(token, config.SECRET) as TokenData;

    let clusterData = await ClusterDbServices.updateClusterByParams("password = $1", "email = $2", [hashedPassword, email])
    if(clusterData){
      return response.status(201).json({
        messages: ["Password Reset Successful"],
        status: "success",
        statusCode: 201,
        payload: clusterData
      })
    }

  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}