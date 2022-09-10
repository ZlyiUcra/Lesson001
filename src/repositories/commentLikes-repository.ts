import {CommentLikeType} from "../db/types";
import {commentLikeModel} from "../db/mongoose/models";
import {UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";

export const commentLikesRepository = {

  async upsert(commentLike: CommentLikeType): Promise<boolean> {
    const result: UpdateResult = await commentLikeModel.updateOne({id: commentLike.id}, {$set: commentLike}, {upsert: true});
    // if(!commentLike.userId)
    //   await commentLikeModel.deleteOne({id: commentLike.id});
    if (result.upsertedCount === 1) {
      return true
    }
    return false
  },
  async findByCommentIdAndUserId(commentId: string, userId: string | null): Promise<CommentLikeType | null> {
    const commentLike = await commentLikeModel.findOne({commentId, userId: userId}, projection).lean();
    return commentLike
  },
  async findByIds(commentIds: Array<string>): Promise<Array<CommentLikeType>> {
    const postsLike = await commentLikeModel.find({commentId: {$in: commentIds}}, projection).lean();
    return postsLike;
  }
}