import { Request, Response } from "express";
import UserDbServices from '../../dbServices/users';
import { UserData } from "interfaces";


export const getUserById = async (request: Request, response: Response) => {
  const {apiKey, userId} = request.params;

  try {
    let user = await UserDbServices.getUserById(userId) as UserData;
    
    if(user){
      if(user.cluster_id !== apiKey){
        return response.status(400).json({message: "User does not belong in cluster"})
      }
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