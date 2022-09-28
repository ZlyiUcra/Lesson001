import "reflect-metadata";
import {CommentLikeType} from "../db/types";
import {UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import mongoose from "mongoose";

@injectable()
export class CommentLikesRepository {
  constructor(
    @inject(TYPES.commentLikeModel) private commentLikeModel: mongoose.Model<CommentLikeType>
  ) {
  }

  async upsert(commentLike: CommentLikeType): Promise<boolean> {
    const result: UpdateResult = await this.commentLikeModel.updateOne({id: commentLike.id}, {$set: commentLike}, {upsert: true});
    if (!commentLike.userId)
      await this.commentLikeModel.deleteOne({id: commentLike.id});
    if (result.upsertedCount === 1) {
      return true
    }
    return false
  }

  async findByCommentIdAndUserId(commentId: string, userId: string | null): Promise<CommentLikeType | null> {
    const commentLike = await this.commentLikeModel.findOne({commentId, userId: userId}, projection).lean();
    return commentLike
  }

  async findByIds(commentIds: Array<string>): Promise<Array<CommentLikeType>> {
    const postsLike = await this.commentLikeModel.find({commentId: {$in: commentIds}}, projection).lean();
    return postsLike;
  }
}

//export const commentLikesRepository = new CommentLikesRepository()