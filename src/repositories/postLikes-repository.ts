import {PostLikeType} from "../db/types";
import {postLikeModel} from "../db/mongoose/models";
import {UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";

export const postLikesRepository = {

  async upsert(postLike: PostLikeType): Promise<boolean> {
    const result: UpdateResult = await postLikeModel.updateOne({id: postLike.id}, {$set: postLike}, {upsert: true});
   console.log("result, postLike", result);
    if(result.upsertedCount === 1){
      return true
    }
    return false
  },
  async findByPostIdAndUserId(postId: string, userId: string):  Promise<PostLikeType | null> {
    const postLike = await postLikeModel.findOne({postId, userId}, projection).lean();
    return postLike
  },
  async findByIds(postIds: Array<string>): Promise<Array<PostLikeType>> {
    const postsLike = await postLikeModel.find({postId: {$in: postIds}}, projection).lean();
    return postsLike;
  }
}