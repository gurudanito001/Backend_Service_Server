import UserDbServices from '../../dbServices/users';
import { Request, Response } from 'express';



export const getAllUsers = async (request: Request, response: Response) => {
  let {apiKey} = request.params;

  try {
    let allUsers = await UserDbServices.getAllUsersByClusterId(apiKey);
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
