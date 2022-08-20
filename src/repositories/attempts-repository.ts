// import {attemptsCollection} from "../db/db";
// import {AttemptsType} from "../db/types";

export const attemptsRepository = {

  // async update(ip: string): Promise<boolean> {
  //
  //   const result = await attemptsCollection.updateOne({ip},
  //     {
  //       $inc: {limitTimeCount: 1},
  //       $set: {lastRequestedAt: new Date()}
  //     },
  //     {upsert: true});
  //   //const attemptsForIP = await this.find(ip);
  //   if(result.upsertedCount) {
  //     return true;
  //   }
  //   return false
  // },
  //
  // async find(ip: string): Promise<AttemptsType> {
  //   return await attemptsCollection.findOne({ip}, {projection: {_id: 0}}) as AttemptsType
  // }
}