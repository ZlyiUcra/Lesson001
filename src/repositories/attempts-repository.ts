import "reflect-metadata";
import {AttemptsDBType, AttemptsType} from "../db/types";
import {attemptModel} from "../db/mongoose/models";
import {projection} from "../helpers/constants";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import mongoose from "mongoose";

@injectable()
export class AttemptsRepository {
  constructor(
    @inject(TYPES.attemptModel) private attemptModel: mongoose.Model<AttemptsDBType>
  ) {
  }

  async updateRequests({ip, url, method, lastRequestsAt}: AttemptsType): Promise<boolean> {
    const update = {
      $set: {lastRequestsAt}
    };

    const result = await attemptModel.updateOne({ip, url, method},
      update,
      {upsert: true});

    if (result.matchedCount) {
      return true;
    }
    return false
  }

  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return await attemptModel.findOne({ip, url, method}, projection).lean() as AttemptsType
  }
}

//export const  attemptsRepository = new AttemptsRepository()