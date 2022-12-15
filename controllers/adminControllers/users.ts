import { Request, Response } from 'express';
import { UserData } from 'interfaces';
import UserDbServices from '../../dbServices/users';
import ClusterDbServices from '../../dbServices/clusters'
import validator from 'validator';
import config from '../../config';
import jwt from 'jsonwebtoken';
import sendEmail from '../../services/sendEmail';
import bcrypt from 'bcrypt';
import { IncomingHttpHeaders } from 'http';

declare module 'http' {
  interface IncomingHttpHeaders {
      "apiKey"?: string
  }
}

const getUsers = async (request: Request, response: Response) => {
  try {
    let allUsers = await UserDbServices.getAllUsers();
    return response.status(201).json(allUsers)
  } 
  catch (error) {
    return response.status(400).json(error)
  } 
}

const getUserById = async (request: Request, response: Response) => {
  const id = request.params.id;

  try {
    let user = await UserDbServices.getUserById(id);
    if(user){
      return response.status(201).json(user)
    }
    return response.status(404).json({error: "User Not Found"})
  } catch (error) {
    return response.status(400).json(error)
  }
}

const createUser = async (request: Request, response: Response) => {
  const data = request.body;
  const {apiKey} = request.headers;
  if(!apiKey){
    return response.status(400).send("apiKey is required")
  }

  let keys = Object.keys(data);
  if(!keys.includes("email") || !keys.includes("password")){
    return response.status(400).send("Email and Password fields are required")
  }
  if(!validator.isEmail(data.email)){
    return response.status(400).send("Email is not valid")
  }
  if(validator.isEmpty(data?.password)){
    return response.status(400).send("Password is required")
  }
  

  try {
    let emailExists = await ClusterDbServices.JsonbDataExists("users", "email", data.email);
    if(emailExists){
      return response.status(400).send("Email already Exists")
    }
    let hashedPassword = await bcrypt.hash(data.password, 7);
    let newData = {...data, password: hashedPassword}
    let user = await UserDbServices.createUser({ cluster_id: apiKey, data: newData }) as UserData

    if(user){
      if(data.test_string === config.TEST_STRING.toString()){
        return response.status(201).json(user)
      }
      let unSignedData = {email: data.email, user_id: user.user_id}
      const token = jwt.sign(unSignedData, config.SECRET, {
        expiresIn: "900000" //15mins
      });
      sendEmail(data.email, `${config.API_BASE_URL}/users/confirmEmail/${token}`, 'verify your email')
      .then(res =>{
        return response.status(201).json({
          messages: ['A verification link has been sent to your email. Link expires in 15mins'],
          status: "success",
          statusCode: 200,
          payload: null
        })
      })
    }

  } catch (error) {
    return response.status(400).json(error)
  } 
}

const updateUser = async (request: Request, response: Response) => {
  const id = request.params.id;
  let data: UserData = request.body;

  try {
    let oldUser: any = await UserDbServices.getUserById(id);
    if(!oldUser){
      return response.status(400).send(`User with ID:${id} does not exist`)
    }
    let newData = { ...oldUser.data, ...data}
    let user = await UserDbServices.updateUser(id, newData)
    if(user){
      return response.status(201).json(user)
    }
  } catch (error) {
    return response.status(400).json(error)
  }
}

const deleteUser = async (request: Request, response: Response) => {
  const id = request.params.id

  try {
    let userId = await UserDbServices.deleteUser(id)
    return response.status(200).send({message: `User deleted with ID: ${userId}`})
  } catch (error) {
    return response.status(400).json(error)
  }
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

