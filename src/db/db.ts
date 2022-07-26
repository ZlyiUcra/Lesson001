import { MongoClient } from "mongodb";

import {BloggerDBType, PostDBType, ProductDBType} from "./types";
// import {VideoType} from "./types";
//
// export let videos: Array<VideoType> = [];
//const mongoUri = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017"; //?/maxPoolSize=20&w=majority
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://Cluster33302:WV1BTERYTERQ@cluster33302.cxqtp.mongodb.net/?retryWrites=true&w=majority"

export const client = new MongoClient(mongoUri);

let db = client.db("instagram")

export const bloggersCollection = db.collection<BloggerDBType>('photos')
export const postsCollection = db.collection<PostDBType>('users')
export const productsCollection = db.collection<ProductDBType>('products')

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    //await client.db("products").command({ping: 1});
    console.log("Connected successfully to mongo server");

  } catch {
    console.log("Can't connect to db");
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
