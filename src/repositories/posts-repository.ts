import {PostDBType, PostPaginatorInputType, PostPaginatorType, PostType} from "../db/types";
import {postsCollection} from "../db/db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";


export const postsRepository = {
  async getAll(postPaginator: PostPaginatorType):
    Promise<{ postsSearch: PostType[], postsCount: number }> {

    const {skip, limit, bloggerId} = postPaginator;

    const searchTerm = bloggerId ? {bloggerId} : {}

    const postsCount = await postsCollection.count(searchTerm);

    const postsSearch: PostType[] = await postsCollection
      .find(searchTerm, {projection: {_id: 0}})
      .skip(skip).limit(limit)
      .toArray();

    return {postsSearch, postsCount};
  },
  async create(post: PostType): Promise<PostType> {

    const resultPost: PostDBType = {
      ...post,
      _id: new ObjectId()
    };

    await postsCollection.insertOne(resultPost);

    return await postsCollection.findOne({id: post.id}, {projection: {_id: 0}}) as PostType;
  },
  async findById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({id}, {projection:  {_id: 0}});
  },
  async update(post: PostType): Promise<boolean> {
    const {id, ...restPost} = post;
    let result: UpdateResult =
      await postsCollection.updateOne({id}, {$set: {...restPost}})
    if (result.modifiedCount || (result.matchedCount && !result.modifiedCount)) {
      return true;
    }
    return false;
  },
  async delete(id: string): Promise<boolean> {
    let result: DeleteResult = await postsCollection.deleteOne({id});
    if (result.deletedCount) return true;
    return false;
  }
}