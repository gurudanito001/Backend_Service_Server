export interface createClusterData {
  name: String,
  email: String,
  password: String,
  description: String,
  multi_tenant: Boolean
}

export interface PostDataObject {
  apiKey: String,
  collection_name: String,
  data: Object,
  env: String
}

export interface ReadDataObject {
  apiKey: String,
  collection_name: String,
}

export interface ReadOneDataObject {
  apiKey: String,
  collection_name: String,
  document_id: String
}

export interface UpdateOneDataObject {
  apiKey: String,
  collection_name: String,
  document_id: String,
  data: Object
}

export interface deleteOneDataObject {
  apiKey: String,
  collection_name: String,
  document_id: String,
}
