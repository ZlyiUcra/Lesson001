import "reflect-metadata";
import {BloggerDBType, BloggerPaginatorType, BloggerType} from "../db/types";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import mongoose from "mongoose";

@injectable()
export class BloggersRepository {
  constructor(
    @inject(TYPES.bloggerModel) private bloggerModel: mongoose.Model<BloggerDBType>
  ) {
  }
  async getAll(paginatorInput: BloggerPaginatorType):
    Promise<{ bloggersSearch: BloggerType[], bloggersCount: number }> {

    const {searchNameTerm, skip, limit} = paginatorInput;
    const searchTermObject = searchNameTerm ? {name: {$regex: RegExp(searchNameTerm, 'i')}} : {};


    const bloggersCount = await this.bloggerModel.count(searchTermObject);
    const bloggersSearch: BloggerDBType[] = await this.bloggerModel
      .find(searchTermObject, projection)
      .skip(skip).limit(limit)
      .lean();


    return {bloggersSearch, bloggersCount};
  }

  async create(newBlogger: BloggerType): Promise<BloggerType> {
    const resultBlogger: BloggerDBType = {...newBlogger, _id: new ObjectId()}
    await this.bloggerModel.insertMany([resultBlogger]);
    const result = await this.bloggerModel.findOne({id: newBlogger.id}, projection) as BloggerType;
    return result;
  }

  async findById(id: string): Promise<BloggerType | null> {
    return this.bloggerModel.findOne({id}, projection).lean();
  }

  async update({id, name, youtubeUrl}: BloggerType): Promise<boolean> {
    let result: UpdateResult =
      await this.bloggerModel.updateOne({id}, {$set: {name, youtubeUrl}});
    if (result.matchedCount) {
      return true;
    }
    return false;
  }

  async delete(id: string): Promise<boolean> {
    let result: DeleteResult = await this.bloggerModel.deleteOne({id});
    if (result.deletedCount) return true

    return false;
  }
}