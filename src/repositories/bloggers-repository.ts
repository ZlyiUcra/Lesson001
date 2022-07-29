import {BloggerDBType, BloggerPaginatorInput, SearchResultType, BloggerType, ProductDBType} from "../db/types";
import {bloggersCollection} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";

export const bloggersRepository = {
  async findAll(paginatorInput: BloggerPaginatorInput):
    Promise<{ bloggersSearchResult: BloggerType[], bloggersCount: number }> {

    const {searchNameTerm, pageNumber = 1, pageSize = 10} = paginatorInput;
    const searchTermObject = searchNameTerm ? {name: {$regex: RegExp(searchNameTerm, 'i')}} : {};
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;


    const bloggersCount = await bloggersCollection.count(searchTermObject);
    const bloggersSearch: BloggerDBType[] = await bloggersCollection
      .find(searchTermObject)
      .skip(skip).limit(limit)
      .sort({id: 1}).toArray();


    const bloggersSearchResult: BloggerType[] = bloggersSearch.map((e: BloggerDBType): BloggerType => {
      const {_id, ...rest} = e;
      return rest;
    })

    return {bloggersSearchResult, bloggersCount};
  },
  async create(newBlogger: BloggerType): Promise<BloggerType> {
    const resultBlogger: BloggerDBType = {...newBlogger, _id: new ObjectId()}
    const result = await bloggersCollection.insertOne(resultBlogger);
    return newBlogger;
  },
  async findById(id: number): Promise<BloggerType | null> {
    const result: BloggerDBType | null = await bloggersCollection.findOne({id});

    if (!result) return null;

    const {_id, ...blogger} = result;
    return blogger;
  },
  async update(id: number, name: string, youtubeUrl: string): Promise<boolean> {
    let result: UpdateResult =
      await bloggersCollection.updateOne({id}, {$set: {name, youtubeUrl}});
    if (result.modifiedCount) {
      return true;
    }
    return false;
  },
  async delete(id: number): Promise<boolean> {
    let result: DeleteResult = await bloggersCollection.deleteOne({id});
    if (result.deletedCount) return true

    return false;
  }
}