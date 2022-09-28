import "reflect-metadata";
import {BlacklistType} from "../db/types";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import mongoose from "mongoose";

@injectable()
export class BlacklistRepository {
  constructor(
    @inject(TYPES.blacklistModel) private blacklistModel: mongoose.Model<BlacklistType>
  ) {
  }

  async insert(refreshToken: BlacklistType): Promise<boolean> {
    try {
      const result = await this.blacklistModel.insertMany([{_id: new ObjectId(), ...refreshToken}]);
      return true
    } catch (e) {
      console.log("Error inserting blacklist: ", e)
      return false;
    }
  }

  async findByRefreshToken(refreshToken: string): Promise<string | null> {
    const result = await this.blacklistModel.findOne({refreshToken}, {projection: {_id: 0}}).lean();
    return result?.refreshToken ? result.refreshToken : null
  }
}
