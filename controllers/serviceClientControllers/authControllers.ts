import sendEmail from "../../services/sendEmail";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import UserDbServices from '../../dbServices/users';
import ClusterDbServices from '../../dbServices/clusters';
import validator from "validator";
import { UserData, ClusterData, StructureData } from "interfaces";
import { doesDataMatchStructure } from "../../services/doesDataMatchStructure";


interface TokenData{
  email: string,
  user_id: string
}

export const registerUser = async (request: Request, response: Response) => {
  const data = request.body;
  const {apiKey} = request.params ; //apikey will be derived from the appToken in the future

  if(!apiKey){
    return response.status(400).send({message: "apiKey is required"})
  }

  let keys = Object.keys(data);
  if(!keys.includes("email") || !keys.includes("password")){
    return response.status(400).send({message: "Email and Password fields are required"})
  }
  if(!validator.isEmail(data.email)){
    return response.status(400).send({message: "Email is not valid"})
  }
  if(validator.isEmpty(data?.password)){
    return response.status(400).send({message: "Password is required"})
  }
  

  try {
    let emailExists = await ClusterDbServices.JsonbDataExists("users", "email", data.email);
    if(emailExists){
      return response.status(400).send({message: "Email already Exists"})
    }
    let structure = await UserDbServices.getStructureByClusterId(apiKey) as StructureData;
    if(structure){
      let isCorrectStructure = doesDataMatchStructure(data, structure.structure);
      if(!isCorrectStructure){
        return response.status(400).send({message: "Data shape does not match User Structure"})
      }
    }else{
      structure = await UserDbServices.createUserDataStructure(apiKey, data) as StructureData;
    }
    let hashedPassword = await bcrypt.hash(data.password, 7);
    let newData = {...data, password: hashedPassword}
    let user = await UserDbServices.createUser({ cluster_id: apiKey, data: newData }) as UserData
    let {verify_email_url} = await ClusterDbServices.getClusterById(apiKey) as ClusterData

    if(user){
      if(data.test_string === config.TEST_STRING.toString()){
        return response.status(201).json({
          message: ['User Created Successfully'],
          status: "success",
          statusCode: 201,
          payload: {user, structure}
        })
      }
      let unSignedData = {email: data.email, user_id: user.user_id}
      const token = jwt.sign(unSignedData, config.SECRET, {
        expiresIn: "900000" //15mins
      });
      sendEmail({email: data.email, url: `${verify_email_url}?token=${token}`})
      .then(res =>{
        return response.status(201).json({
          message: ['A verification link has been sent to your email. Link expires in 15mins'],
          status: "success",
          statusCode: 200,
          payload: null
        })
      })
    }

  } catch (error: any) {
    return response.status(400).json({message: error.message})
  } 
}

export const authenticateUser = async (request: Request, response: Response) => {
  const {email, password} = request.body;
  try {
    const user = await UserDbServices.getUserByJsonbData('email', email) as UserData;
    if(!user){
      return response.status(404).json({message: "Invalid Email or Password"})
    }
    const isValidPassword = await bcrypt.compare(password, user.data.password);
    if(!isValidPassword){
      return response.status(404).json({message: "Invalid Email or Password"})
    }
    if(!user.email_confirmed){
      return response.status(400).json({message: "Email not verified"})
    }
    return response.status(201).json({
      message: [`Login Successful`],
      status: "success",
      statusCode: 200,
      payload: user
    }) 
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}


export const confirmUserEmail = async (request: Request, response: Response) =>{
  const {token} = request.params;
  
  try {
    let {user_id, email} = jwt.verify(token, config.SECRET) as TokenData;
    let userExists = await UserDbServices.userExists(user_id);
    if(!userExists){
      return response.status(404).json({message: "User does not exist"})
    }
    let user = await UserDbServices.verifyEmail(user_id);
    if(user){
      return response.status(200).json({
        message: ["Email verified Successfully"],
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
  let {email, apiKey} = request.params;
  
  if(!validator.isEmail(email)){
    return response.status(400).send({message: "Email is not valid"})
  }

  try {
    let user = await UserDbServices.getUserByJsonbData('email', email) as UserData;
    if(!user){
      return response.status(404).send({message: "User does not exist"})
    }
    if(user.email_confirmed){
      return response.status(400).send({message: "User email already verified"})
    }

    let unSignedData = { email: email, user_id: user.user_id }
    const token = jwt.sign(unSignedData, config.SECRET, {
      expiresIn: "900000" //15mins
    });
    const {verify_email_url} = await ClusterDbServices.getClusterById(apiKey) as ClusterData
    sendEmail({email, url: `${verify_email_url}?token=${token}`})
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


export const resetUserPassword = async (request: Request, response: Response) =>{
  const {email} = request.body;
  let {apiKey} = request.params;
  
  try {
    let user = await UserDbServices.getUserByJsonbData("email", email) as UserData;
    let {reset_password_url} = await ClusterDbServices.getClusterById(apiKey) as ClusterData
    if(!user){
      return response.status(400).send({message: "Email does not exist"})
    }
    let token = jwt.sign({email: email, user_id: user.user_id}, config.SECRET, {expiresIn: "900000"})
    sendEmail({email, url: `${reset_password_url}?token=${token}`, message: "reset your password", buttonText: "Reset Password"})
      .then(res =>{
        return response.status(200).json({
          message: ['A reset password link has been sent to your email. Link expires in 15mins'],
          status: "success",
          statusCode: 200,
          payload: null
        })
      })
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}


export const changeUserPassword = async (request: Request, response: Response) =>{
  const {token} = request.params;
  const {newPassword} = request.body;
  
  try {
    let {user_id, email} = jwt.verify(token, config.SECRET) as TokenData;
    let hashedPassword = await bcrypt.hash(newPassword, 7);
    let user = await UserDbServices.getUserById(user_id) as UserData;
    let updatedData = {...user.data, password: hashedPassword}
    let updatedUser = await UserDbServices.updateUser(user_id, updatedData)
    if(updatedUser){
      return response.status(200).json({
        message: ["Password Reset Successful"],
        status: "success",
        statusCode: 200,
        payload: updatedUser
      })
    }
  } catch (error: any) {
    return response.status(400).send({message: error.message})
  }
}