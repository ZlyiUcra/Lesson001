import {CommentLikeType} from "../db/types";
import {commentLikeModel} from "../db/mongoose/models";
import {UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";

export const commentLikesRepository = {

  async upsert(commentLike: CommentLikeType): Promise<boolean> {
    const result: UpdateResult = await commentLikeModel.updateOne({id: commentLike.id}, {$set: commentLike}, {upsert: true});
    if (result.matchedCount === 1) {
      return true
    }
    return false
  },
  async findByCommentIdAndUserId(commentId: string, userId: string): Promise<CommentLikeType | null> {
    const commentLike = await commentLikeModel.findOne({commentId, userId}, projection).lean();
    return commentLike
  },
  async findByIds(commentIds: Array<string>): Promise<Array<CommentLikeType>> {
    const postsLike = await commentLikeModel.find({commentId: {$in: commentIds}}, projection).lean();
    return postsLike;
  }

}