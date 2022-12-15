import exp from "constants"

export interface ClusterData {
  cluster_id?: string,
  name: string,
  email: string,
  password: string,
  description: string,
  multi_tenant: boolean,
  created_at?: string,
  updated_at?: string
}
export interface CollectionData {
  collection_id?: string | null,
  cluster_id: string,
  name: string,
  structure?: object,
  created_at?: string,
  updated_at?: string
}
export interface DocumentData {
  document_id?: string,
  cluster_id: string,
  collection_id: string | null,
  user_id?: string | null,
  collection_name: string,
  data: object,
  created_at?: string,
  updated_at?: string
}

export interface UserData {
  user_id?: string,
  cluster_id: string,
  data: object
}

export interface PostDataObject {
  apiKey: string,
  collection_name: string,
  data: Object
}

export interface ReadDataObject {
  apiKey: string,
  collection_name: string,
}

export interface ReadOneDataObject {
  apiKey: string,
  collection_name: string,
  document_id: string
}

export interface UpdateOneDataObject {
  apiKey: string,
  collection_name: string,
  document_id: string,
  data: Object
}

export interface DeleteOneDataObject {
  apiKey: string,
  collection_name: string,
  document_id: string,
}

export interface LoginCredentials {
  email: string,
  password: string
}
