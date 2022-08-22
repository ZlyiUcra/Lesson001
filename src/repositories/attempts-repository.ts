import {attemptsCollection} from "../db/db";
import {AttemptsType} from "../db/types";

export const attemptsRepository = {

  async update(ip: string, url: string, method: string, limitTimeCount?: number): Promise<boolean> {
    const update = typeof limitTimeCount === "number" ? {
      $set: {lastRequestedAt: new Date(), limitTimeCount}
    } : {
      $inc: {limitTimeCount: 1},
      $set: {lastRequestedAt: new Date()}
    };

    const result = await attemptsCollection.updateOne({ip, url, method},
      update,
      {upsert: true});
    //const attemptsForIP = await this.find(ip);
    if (result.upsertedCount) {
      return true;
    }
    return false
  },

  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return await attemptsCollection.findOne({ip, url, method}, {projection: {_id: 0}}) as AttemptsType
  }
}