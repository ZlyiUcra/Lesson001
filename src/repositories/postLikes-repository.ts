import "reflect-metadata";
import {PostLikeType} from "../db/types";
import {UpdateResult} from "mongodb";
import {projection} from "../helpers/constants";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import mongoose from "mongoose";

@injectable()
export class PostLikesRepository {
  constructor(
    @inject(TYPES.postLikeModel) private postLikeModel: mongoose.Model<PostLikeType>
  ) {
  }
  async upsert(postLike: PostLikeType): Promise<boolean> {
    const result: UpdateResult = await this.postLikeModel.updateOne({id: postLike.id}, {$set: postLike}, {upsert: true});
    if (!postLike.userId)
      await this.postLikeModel.deleteOne({id: postLike.id})
    if (result.upsertedCount === 1) {
      return true
    }
    return false
  }

  async findByPostIdAndUserId(postId: string, userId: string | null): Promise<PostLikeType | null> {
    const postLike = await this.postLikeModel.findOne({postId, userId: userId}, projection).lean();
    return postLike
  }

  async findByIds(postIds: Array<string>): Promise<Array<PostLikeType>> {
    const postsLike = await this.postLikeModel.find({postId: {$in: postIds}}, projection).lean();
    return postsLike;
  }
}
