import {BloggerDBType, BloggerPaginatorInputType, BloggerPaginatorType, BloggerType} from "../db/types";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {bloggerModel} from "../db/mongoose/models";
import {projection} from "../helpers/constants";

export const bloggersRepository = {
  async getAll(paginatorInput: BloggerPaginatorType):
    Promise<{ bloggersSearch: BloggerType[], bloggersCount: number }> {

    const {searchNameTerm, skip, limit} = paginatorInput;
    const searchTermObject = searchNameTerm ? {name: {$regex: RegExp(searchNameTerm, 'i')}} : {};


    const bloggersCount = await bloggerModel.count(searchTermObject);
    const bloggersSearch: BloggerDBType[] = await bloggerModel
      .find(searchTermObject, projection)
      .skip(skip).limit(limit)
      .lean();


    return {bloggersSearch, bloggersCount};
  },
  async create(newBlogger: BloggerType): Promise<BloggerType> {
    const resultBlogger: BloggerDBType = {...newBlogger, _id: new ObjectId()}
    await bloggerModel.insertMany([resultBlogger]);
    const result = await bloggerModel.findOne({id: newBlogger.id}, projection) as BloggerType;
    return result;
  },
  async findById(id: string): Promise<BloggerType | null> {
    return bloggerModel.findOne({id}, projection);
  },
  async update({id, name, youtubeUrl}: BloggerType): Promise<boolean> {
    let result: UpdateResult =
      await bloggerModel.updateOne({id}, {$set: {name, youtubeUrl}});
    if (result.matchedCount) {
      return true;
    }
    return false;
  },
  async delete(id: string): Promise<boolean> {
    let result: DeleteResult = await bloggerModel.deleteOne({id});
    if (result.deletedCount) return true

    return false;
  }
}