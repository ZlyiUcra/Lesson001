import {CommentType, CommentDBType, CommentContentType, CommentsPaginatorType} from "../db/types";
import {commentsCollection} from "../db/db";
import {DeleteResult, ObjectId} from "mongodb";

export const commentsRepository = {
  async getAll(searchPostComments: CommentsPaginatorType):
    Promise<{ commentsSearch: CommentType[], commentsCount: number }> {

    const {postId, limit, skip} = searchPostComments;

    const commentsCount = await commentsCollection.count({postId});
    const commentsSearch: CommentDBType[] = await commentsCollection
      .find({postId}, {projection: {_id: 0, postId: 0}})
      .skip(skip).limit(limit)
      .toArray();

    return {commentsSearch, commentsCount};
  },
  async create(comment: CommentType, postId: string): Promise<CommentType> {
    const resultComment: CommentDBType = {...comment, postId, _id: new ObjectId()}
    await commentsCollection.insertOne(resultComment);
    const result = await commentsCollection
      .findOne({id: comment.id}, {projection: {_id: 0}}) as CommentType;
    return result;
  },

  async findById(id: string): Promise<CommentType | null> {
    return await commentsCollection.findOne({id}, {projection: {_id: 0}});
  },
  async update(comment: CommentContentType, commentId: string) {
    const result = await commentsCollection.updateOne(
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
    const result: DeleteResult = await commentsCollection.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  },

}