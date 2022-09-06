import {CommentType, CommentDBType, CommentContentType, CommentsPaginatorType} from "../db/types";
import {DeleteResult, ObjectId} from "mongodb";
import {commentModel} from "../db/mongoose/models";
import {projection, projectionExcludePostId} from "../helpers/constants";

export const commentsRepository = {
  async getAll(searchPostComments: CommentsPaginatorType):
    Promise<{ commentsSearch: CommentType[], commentsCount: number }> {

    const {postId, limit, skip} = searchPostComments;

    const commentsCount = await commentModel.count({postId});
    const commentsSearch: CommentDBType[] = await commentModel
      .find({postId}, projection)
      .skip(skip).limit(limit)
      .lean();

    return {commentsSearch, commentsCount};
  },
  async create(comment: CommentType, postId: string): Promise<CommentType> {
    const resultComment: CommentDBType = {...comment, postId, _id: new ObjectId()}
    await commentModel.insertMany([resultComment]);
    const result = await commentModel
      .findOne({id: comment.id}, projection) as CommentType;
    return result;
  },

  async findById(id: string): Promise<CommentType | null> {
    return commentModel.findOne({id}, projectionExcludePostId);
  },
  async update(comment: CommentContentType, commentId: string) {
    const result = await commentModel.updateOne(
      {id: commentId},
      {
        $set:
          {content: comment.content}
      })
    if (result.modifiedCount || (result.matchedCount && !result.modifiedCount)) {
      return true;
    }
    return false;
  },
  async delete(id: string) {
    const result: DeleteResult = await commentModel.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  }
}