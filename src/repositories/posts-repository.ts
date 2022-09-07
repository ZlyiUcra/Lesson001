import {PostDBType, PostPaginatorInputType, PostPaginatorType, PostType} from "../db/types";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {postModel} from "../db/mongoose/models";
import {projection} from "../helpers/constants";


export const postsRepository = {
  async getAll(postPaginator: PostPaginatorType):
    Promise<{ postsSearch: PostType[], postsCount: number }> {

    const {skip, limit, bloggerId} = postPaginator;

    const searchTerm = bloggerId ? {bloggerId} : {}

    const postsCount = await postModel.count(searchTerm);

    const postsSearch: PostType[] = await postModel
      .find(searchTerm, projection)
      .skip(skip).limit(limit)
      .lean();

    return {postsSearch, postsCount};
  },
  async create(post: PostType): Promise<PostType> {

    const resultPost: PostDBType = {
      ...post,
      _id: new ObjectId()
    };

    await postModel.insertMany([resultPost]);

    return await postModel.findOne({id: post.id}, projection) as PostType;
  },
  async findById(id: string): Promise<PostType | null> {
    return postModel.findOne({id}, projection).lean();
  },
  async update(post: PostType): Promise<boolean> {
    const {id, ...restPost} = post;
    let result: UpdateResult =
      await postModel.updateOne({id}, {$set: {...restPost}})
    if (result.modifiedCount || (result.matchedCount && !result.modifiedCount)) {
      return true;
    }
    return false;
  },
  async delete(id: string): Promise<boolean> {
    let result: DeleteResult = await postModel.deleteOne({id});
    if (result.deletedCount) return true;
    return false;
  }
}