import {BlacklistType} from "../db/types";
import {blacklistCollection} from "../db/db";
import { ObjectId } from "mongodb";

export const blacklistRepository = {
  async insert(refreshToken: BlacklistType): Promise<boolean>{
    const result = await blacklistCollection.insertOne({_id: new ObjectId(), ...refreshToken})
    if(result.insertedId) { return true}
    return false
  },
  async findByRefreshToken(refreshToken: string): Promise<string | null>{
    const result= await blacklistCollection.findOne({refreshToken}, {projection: {_id: 0}});
      return result?.refreshToken ? result.refreshToken : null
  }
}