import {AttemptsType} from "../db/types";
import {attemptModel} from "../db/mongoose/models";
import {projection} from "../helpers/constants";

export class AttemptsRepository {

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

export const  attemptsRepository = new AttemptsRepository()