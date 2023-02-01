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
const dbConnection_1 = __importDefault(require("../dbConnection"));
const getAllCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM collections', (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows);
        });
    });
});
const getCollectionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('SELECT * FROM collections WHERE collection_id = $1', [id], (error, results) => {
            if (error) {
                console.log(error);
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
/* const getCollectionByParams = async (whereString: string, paramsObject: object) =>{
  const values = Object.values(paramsObject);

  return new Promise((resolve, reject)=>{
    pool.query(`SELECT * FROM collections WHERE ${whereString}`, [...values], (error: any, results: any) => {
      if (error) {
        return reject(error.message)
      }
      return resolve(results.rows[0])
    })
  })
} */
const collectionExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM collections WHERE collection_id = $1)`, [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const customCollectionExists = (whereString, paramsObject) => __awaiter(void 0, void 0, void 0, function* () {
    const values = Object.values(paramsObject);
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`select exists(SELECT * FROM collections WHERE ${whereString})`, [...values], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0].exists);
        });
    });
});
const customGetCollection = (whereString, valueArray) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query(`SELECT * FROM collections WHERE ${whereString}`, [...valueArray], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const createCollection = (collectionData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cluster_id, structure } = collectionData;
    let lowerCaseName = name.toLocaleLowerCase();
    const date = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('INSERT INTO collections (name, structure, cluster_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [lowerCaseName, structure, cluster_id, date, date], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const updateCollection = (id, updateCollectionData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = updateCollectionData;
    let lowerCaseName = name.toLocaleLowerCase();
    // After updating a collection name, you will need to update the name in all documents that belong to that collection
    const updated_at = Date.now().toString();
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('UPDATE collections SET name = $1, updated_at = $2 WHERE collection_id = $3 RETURNING *', [lowerCaseName, updated_at, id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(results.rows[0]);
        });
    });
});
const deleteCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        dbConnection_1.default.query('DELETE FROM collections WHERE collection_id = $1', [id], (error, results) => {
            if (error) {
                return reject(error.message);
            }
            return resolve(id);
        });
    });
});
exports.default = {
    getAllCollections,
    getCollectionById,
    //getCollectionByParams,
    collectionExists,
    customCollectionExists,
    customGetCollection,
    createCollection,
    updateCollection,
    deleteCollection,
};
//# sourceMappingURL=collections.js.map