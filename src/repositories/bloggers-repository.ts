import {BloggerDBType, BloggerPaginatorInputType, BloggerPaginatorType, BloggerType} from "../db/types";
import {bloggersCollection} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

export const bloggersRepository = {
  async getAll(paginatorInput: BloggerPaginatorType):
    Promise<{ bloggersSearch: BloggerType[], bloggersCount: number }> {

    const {searchNameTerm, skip, limit} = paginatorInput;
    const searchTermObject = searchNameTerm ? {name: {$regex: RegExp(searchNameTerm, 'i')}} : {};


    const bloggersCount = await bloggersCollection.count(searchTermObject);
    const bloggersSearch: BloggerDBType[] = await bloggersCollection
      .find(searchTermObject, {projection: {_id: 0}})
      .skip(skip).limit(limit)
      .toArray();


    return {bloggersSearch, bloggersCount};
  },
  async create(newBlogger: BloggerType): Promise<BloggerType> {
    const resultBlogger: BloggerDBType = {...newBlogger, _id: new ObjectId()}
    await bloggersCollection.insertOne(resultBlogger);
    const result = await bloggersCollection.findOne({id: newBlogger.id}, {projection: {_id: 0}}) as BloggerType;
    return result;
  },
  async findById(id: string): Promise<BloggerType | null> {
    return await bloggersCollection.findOne({id}, {projection: {_id: 0}});
  },
  async update({id, name, youtubeUrl}: BloggerType): Promise<boolean> {
    let result: UpdateResult =
      await bloggersCollection.updateOne({id}, {$set: {name, youtubeUrl}});
    if (result.matchedCount) {
      return true;
    }
    return false;
  },
  async delete(id: string): Promise<boolean> {
    let result: DeleteResult = await bloggersCollection.deleteOne({id});
    if (result.deletedCount) return true

    return false;
  }
}