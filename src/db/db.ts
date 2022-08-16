import { MongoClient } from "mongodb";

import {BloggerDBType, CommentDBType, PostDBType, ProductDBType, TokenDBType, UserDBType} from "./types";
import {settings} from "../settings";



export const client = new MongoClient(settings.MONGO_URI);

let db = client.db("instagram")

export const authCollection = db.collection<TokenDBType>('auth')
export const commentsCollection = db.collection<CommentDBType>('comments')
export const usersCollection = db.collection<UserDBType>('users')
export const bloggersCollection = db.collection<BloggerDBType>('bloggers')
export const postsCollection = db.collection<PostDBType>('posts')
export const productsCollection = db.collection<ProductDBType>('products')

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    await client.db("bloggers").command({ping: 1});
    console.log("Connected successfully to mongo server");

  } catch {
    console.log("Can't connect to db");
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
