import {attemptsCollection} from "../db/db";
import {AttemptsType} from "../db/types";

export const attemptsRepository = {

  async updateRequests({ip, url, method, lastRequestsAt}: AttemptsType): Promise<boolean> {
    const update = {
      $set: {lastRequestsAt}
    };

    const result = await attemptsCollection.updateOne({ip, url, method},
      update,
      {upsert: true});

    if (result.matchedCount) {
      return true;
    }
    return false
  },
  // async incrementCounter({ip, url, method}: AttemptsType): Promise<boolean> {
  //   const update = {
  //     $inc: {limitTimeCount: 1},
  //   };
  //   const result = await attemptsCollection.updateOne({ip, url, method},
  //     update,
  //     {upsert: true});
  //   if (result.matchedCount) {
  //     return true;
  //   }
  //   return false
  // },

  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return await attemptsCollection.findOne({ip, url, method}, {projection: {_id: 0}}) as AttemptsType
  }
}