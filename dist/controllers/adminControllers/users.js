"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../../dbServices/users"));
const authControllers_1 = require("../serviceClientControllers/authControllers");
const getUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allUsers = yield users_1.default.getAllUsers();
        return response.status(200).json({
            message: [`Users fetched SuccessFully`],
            status: "success",
            statusCode: 200,
            payload: allUsers
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const getUserById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let user = yield users_1.default.getUserById(id);
        if (user) {
            return response.status(200).json({
                message: [`User fetched SuccessFully`],
                status: "success",
                statusCode: 200,
                payload: user
            });
        }
        return response.status(404).json({ message: "User Not Found" });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
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
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    let data = request.body.data;
    try {
        let oldUser = yield users_1.default.getUserById(id);
        if (!oldUser) {
            return response.status(400).send({ message: `User with ID:${id} does not exist` });
        }
        let newData = Object.assign(Object.assign({}, oldUser.data), data);
        let user = yield users_1.default.updateUser(id, newData);
        if (user) {
            return response.status(201).json({
                message: ['User updated successfully'],
                status: "success",
                statusCode: 200,
                payload: user
            });
        }
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const deleteUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let userId = yield users_1.default.deleteUser(id);
        return response.status(200).send({
            message: [`User deleted with ID: ${userId}`],
            status: "success",
            statusCode: 200,
            payload: null
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const getStructures = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allStructures = yield users_1.default.getAllStructures();
        return response.status(200).json({
            message: ['Structures fetched successfully'],
            status: "success",
            statusCode: 200,
            payload: allStructures
        });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const getStructureByClusterId = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let structure = yield users_1.default.getStructureByClusterId(id);
        if (structure) {
            return response.status(200).json({
                message: ['Structure fetched successfully'],
                status: "success",
                statusCode: 200,
                payload: structure
            });
        }
        return response.status(404).json({ message: "User Not Found" });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
const deleteStructure = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let cluster_id = yield users_1.default.deleteStructure(id);
        return response.status(200).send({
            message: [`User Structure deleted with ID: ${cluster_id}`],
            status: "success",
            statusCode: 200,
            payload: null
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.default = {
    getUsers,
    getUserById,
    createUser: authControllers_1.registerUser,
    updateUser,
    deleteUser,
    getStructures,
    getStructureByClusterId,
    deleteStructure
};
//# sourceMappingURL=users.js.map