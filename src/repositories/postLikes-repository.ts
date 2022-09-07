import {PostLikeType} from "../db/types";
import {postLikeModel} from "../db/mongoose/models";
import {UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";

export const postLikesRepository = {

  async upsert(postLike: PostLikeType): Promise<boolean> {
    const result: UpdateResult = await postLikeModel.updateOne({id: postLike.id}, {$set: postLike}, {upsert: true});

    if(result.matchedCount === 1){
      return true
    }
    return false
  },
  async findByPostIdAndUserId(postId: string, userId: string):  Promise<PostLikeType | null> {
    const postLike = await postLikeModel.findOne({postId, userId}, projection).lean();
    return postLike
  }
}