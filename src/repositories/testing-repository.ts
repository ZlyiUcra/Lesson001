import {connection} from "mongoose";


export class TestingRepository {
  async deleteAll(): Promise<boolean> {
    try {
      const collections = await connection.db.collections()

      for (let collection of collections) {
        await collection.drop()
      }
      return true
    } catch (e) {
      return false;
    }
  }
}

export const testingRepository = new TestingRepository()