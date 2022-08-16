import { db } from "../db/db";

export const testingRepository = {
  async deleteAll(): Promise<boolean> {
    let result = true;
    const calls = await db.listCollections().toArray()
     for (const c of calls) {
       result = result && await db.collection(c.name).drop();
     }
    return result
  }
}