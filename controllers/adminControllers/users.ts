import { Request, Response } from 'express';
import { UserData } from 'interfaces';
import UserDbServices from '../../dbServices/users';
import ClusterDbServices from '../../dbServices/clusters'
import validator from 'validator';
import config from '../../config';
import jwt from 'jsonwebtoken';
import sendEmail from '../../services/sendEmail';
import bcrypt from 'bcrypt';
import { registerUser } from '../serviceClientControllers/authControllers';

declare module 'http' {
  interface IncomingHttpHeaders {
      "apiKey"?: string
  }
}

const getUsers = async (request: Request, response: Response) => {
  try {
    let allUsers = await UserDbServices.getAllUsers();
    return response.status(200).json({
      message: [`Users fetched SuccessFully`],
      status: "success",
      statusCode: 200,
      payload: allUsers
    })
  } 
  catch (error: any) {
    return response.status(400).json({message: error.message})
  } 
}

const getUserById = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let user = await UserDbServices.getUserById(id);
    if(user){
      return response.status(200).json({
        message: [`User fetched SuccessFully`],
        status: "success",
        statusCode: 200,
        payload: user
      })
    }
    return response.status(404).json({message: "User Not Found"})
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

/* const createUser = async (request: Request, response: Response) => {
  const data = request.body.data;
  const apikey = request.body.cluster_id as string; //apikey will be derived from the appToken in the future
  let structure;


  if(!apikey){
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
    let hashedPassword = await bcrypt.hash(data.password, 7);
    let newData = {...data, password: hashedPassword}
    let user: UserData = await UserDbServices.createUser({ cluster_id: apikey, data: newData }) as UserData
    let structureExists = await UserDbServices.structureExists(apikey);
    if(!structureExists){
      structure = await UserDbServices.createUserDataStructure(apikey, data);
    }

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
      sendEmail({email: data.email, url: `${config.API_BASE_URL}/users/confirmEmail/${token}`})
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
} */

const updateUser = async (request: Request, response: Response) => {
  const id = request.params.id;
  let data: UserData = request.body.data;

  try {
    let oldUser: any = await UserDbServices.getUserById(id);
    if(!oldUser){
      return response.status(400).send({message: `User with ID:${id} does not exist`})
    }
    let newData = { ...oldUser.data, ...data}
    let user = await UserDbServices.updateUser(id, newData)
    if(user){
      return response.status(201).json({
        message: ['User updated successfully'],
        status: "success",
        statusCode: 200,
        payload: user
      })
    }
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const deleteUser = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let userId = await UserDbServices.deleteUser(id)
    return response.status(200).send({
      message: [`User deleted with ID: ${userId}`],
      status: "success",
      statusCode: 200,
      payload: null
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}



const getStructures = async (request: Request, response: Response) => {
  try {
    let allStructures = await UserDbServices.getAllStructures();
    return response.status(200).json({
      message: ['Structures fetched successfully'],
      status: "success",
      statusCode: 200,
      payload: allStructures
    })
  } 
  catch (error) {
    return response.status(400).json(error)
  } 
}

const getStructureByClusterId = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let structure = await UserDbServices.getStructureByClusterId(id);
    if(structure){
      return response.status(200).json({
        message: ['Structure fetched successfully'],
        status: "success",
        statusCode: 200,
        payload: structure
      })
    }
    return response.status(404).json({message: "User Not Found"})
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}

const deleteStructure = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let cluster_id = await UserDbServices.deleteStructure(id)
    return response.status(200).send({
      message: [`User Structure deleted with ID: ${cluster_id}`],
      status: "success",
      statusCode: 200,
      payload: null
    })
  } catch (error: any) {
    return response.status(400).json({message: error.message})
  }
}





export default {
  getUsers,
  getUserById,
  createUser: registerUser,
  updateUser,
  deleteUser,
  getStructures,
  getStructureByClusterId,
  deleteStructure
}

