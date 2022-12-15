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
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const getClusters = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allClusters = yield clusters_1.default.getAllClusters();
        return response.status(201).json(allClusters);
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const Authenticate = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const cluster = yield clusters_1.default.getClusterByParams('email = $1', [email]);
    if (!cluster) {
        return response.status(404).json({ message: "Invalid Login Credentials" });
    }
    const isValidPassword = yield bcrypt_1.default.compare(password, cluster.password);
    if (!isValidPassword) {
        return response.status(404).json({ message: "Invalid Login Credentials" });
    }
    return response.status(201).json(cluster);
});
const getClusterById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const clusterId = request.params.id;
    try {
        let cluster = yield clusters_1.default.getClusterById(clusterId);
        if (cluster) {
            return response.status(201).json(cluster);
        }
        return response.status(404).json({ error: "Cluster Not Found" });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const createCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, description, multi_tenant, test_string } = request.body;
    try {
        let hashedPassword = yield bcrypt_1.default.hash(password, 7);
        let emailExists = yield clusters_1.default.valueExists("clusters", "email", email);
        if (emailExists) {
            return response.status(400).send("Email Already Exists");
        }
        let cluster = yield clusters_1.default.createCluster({ name, email, password: hashedPassword, description, multi_tenant });
        if (cluster) {
            if (test_string === config_1.default.TEST_STRING.toString()) {
                return response.status(201).json(cluster);
            }
            let unSignedData = { email: cluster.email, cluster_id: cluster.cluster_id };
            const token = jsonwebtoken_1.default.sign(unSignedData, config_1.default.SECRET, {
                expiresIn: "900000" //15mins
            });
            (0, sendEmail_1.default)(cluster.email, `http://localhost:8080/confirmEmail/${token}`)
                .then(res => {
                return response.status(201).json({
                    messages: [res.message],
                    status: "success",
                    statusCode: 201,
                    payload: cluster
                });
            });
        }
    }
    catch (error) {
        return response.status(400).json({ error });
    }
});
const updateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const { name, email, password, description, multi_tenant } = request.body;
    try {
        let cluster = yield clusters_1.default.updateCluster(id, { name, email, password, description, multi_tenant });
        if (cluster) {
            return response.status(201).json(cluster);
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const deActivateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let cluster = yield clusters_1.default.deActivateCluster(id);
        return response.status(200).json(cluster);
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const reActivateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let cluster = yield clusters_1.default.reActivateCluster(id);
        return response.status(200).json(cluster);
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
const deleteCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        let clusterId = yield clusters_1.default.deleteCluster(id);
        return response.status(200).json({ message: `Cluster deleted with ID: ${clusterId}` });
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
exports.default = {
    getClusters,
    getClusterById,
    createCluster,
    Authenticate,
    updateCluster,
    deActivateCluster,
    reActivateCluster,
    deleteCluster,
};
//# sourceMappingURL=clusters.js.map