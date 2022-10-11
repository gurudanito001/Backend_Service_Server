import { PrismaClient, Prisma } from '@prisma/client';
import pool from '../dbConnection';
import { createClusterData } from '../interfaces';

const client = new PrismaClient()

export async function getAllClusters (){
  let clusters = await pool.query('SELECT * from clusters', (error: any, results: any) =>{
    if(error){
      throw error
    }
    return results.rows[0]
  })
  return clusters
  /* let clusters = await client.clusters.findMany()
  return clusters */
}

export async function getOneClusterById (cluster_id: string){
  const cluster = await client.clusters.findUnique({
    where: {
      cluster_id: cluster_id ,
    },
  })
  return cluster;
}

export async function createOneCluster(clusterData: createClusterData) {
  let { name, email, password, description, multi_tenant } = clusterData;
  pool.query('INSERT INTO clusters (name, email, password, description, multi_tenant) VALUES ($1, $2, $3, $4, $5) RETURNING cluster_id', [name, email, password, description, multi_tenant], (error: any, results: any) => {
    if (error) {
      throw error
    }
    return results.rows[0]
  })

}