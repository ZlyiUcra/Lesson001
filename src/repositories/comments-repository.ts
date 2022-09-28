import "reflect-metadata";
import {CommentType, CommentDBType, CommentContentType, CommentsPaginatorType} from "../db/types";
import {DeleteResult, ObjectId} from "mongodb";
import {projectionExcludePostId} from "../helpers/constants";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import mongoose from "mongoose";

@injectable()
export class CommentsRepository {
  constructor(
    @inject(TYPES.commentModel) private commentModel: mongoose.Model<CommentDBType>
  ) {
  }

  async getAll(searchPostComments: CommentsPaginatorType):
    Promise<{ commentsSearch: CommentType[], commentsCount: number }> {

    const {postId, limit, skip} = searchPostComments;

    const commentsCount = await this.commentModel.count({postId});
    const commentsSearch: CommentType[] = await this.commentModel
      .find({postId}, projectionExcludePostId)
      .skip(skip).limit(limit)
      .lean();

    return {commentsSearch, commentsCount};
  }

  async create(comment: CommentType, postId: string): Promise<CommentType> {
    const resultComment: CommentDBType = {...comment, postId, _id: new ObjectId()}
    await this.commentModel.insertMany([resultComment]);
    const result = await this.commentModel
      .findOne({id: comment.id}, projectionExcludePostId).lean() as CommentType;
    return result;
  }

  async findById(id: string): Promise<CommentType | null> {
    return this.commentModel.findOne({id}, projectionExcludePostId).lean();
  }

  async update(comment: CommentContentType, commentId: string) {
    const result = await this.commentModel.updateOne(
      {id: commentId},
      {
        $set:
          {content: comment.content}
      })
    if (result.modifiedCount || (result.matchedCount && !result.modifiedCount)) {
      return true;
    }
    return false;
  }

  async delete(id: string) {
    const result: DeleteResult = await this.commentModel.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  }
}

//export const commentsRepository = new CommentsRepository()