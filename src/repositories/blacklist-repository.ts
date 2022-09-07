import {BlacklistType} from "../db/types";
import {ObjectId} from "mongodb";
import {blacklistModel} from "../db/mongoose/models";

export const blacklistRepository = {
  async insert(refreshToken: BlacklistType): Promise<boolean> {
    try {
      const result = await blacklistModel.insertMany([{_id: new ObjectId(), ...refreshToken}]);
      console.log("Blacklist insert result:", result)
      return true
    } catch (e) {
      console.log("Error inserting blacklist: ", e)
      return false;
    }
  },
  async findByRefreshToken(refreshToken: string): Promise<string | null> {
    const result = await blacklistModel.findOne({refreshToken}, {projection: {_id: 0}}).lean();
    return result?.refreshToken ? result.refreshToken : null
  }
}