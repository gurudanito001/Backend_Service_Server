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
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const validator_1 = __importDefault(require("validator"));
const getUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allUsers = yield users_1.default.getAllUsers();
        return response.status(201).json(allUsers);
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const getUserById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let user = yield users_1.default.getUserById(id);
        if (user) {
            return response.status(201).json(user);
        }
        return response.status(404).json({ error: "User Not Found" });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { cluster_id, data } = request.body;
    let keys = Object.keys(data);
    if (!keys.includes("email") || !keys.includes("password")) {
        return response.status(400).send("Email and Password fields are required");
    }
    if (!validator_1.default.isEmail(data.email)) {
        return response.status(400).send("Email is not valid");
    }
    if (validator_1.default.isEmpty(data === null || data === void 0 ? void 0 : data.password)) {
        return response.status(400).send("Password is required");
    }
    try {
        let emailExists = yield clusters_1.default.JsonbDataExists("users", "email", data.email);
        if (emailExists) {
            return response.status(400).send("Email already Exists");
        }
        let user = yield users_1.default.createUser({ cluster_id, data });
        if (user) {
            return response.status(201).json(user);
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    let data = request.body;
    try {
        let oldUser = yield users_1.default.getUserById(id);
        if (!oldUser) {
            return response.status(400).send(`User with ID:${id} does not exist`);
        }
        let newData = Object.assign(Object.assign({}, oldUser.data), data);
        let user = yield users_1.default.updateUser(id, newData);
        if (user) {
            return response.status(201).json(user);
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const deleteUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let userId = yield users_1.default.deleteUser(id);
        return response.status(200).send({ message: `User deleted with ID: ${userId}` });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
exports.default = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=users.js.map