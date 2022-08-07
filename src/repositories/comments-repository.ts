import {
  BloggerDBType,
  BloggerPaginatorInputType,
  SearchResultType,
  BloggerType,
  ProductDBType,
  PostCommentsInputType, CommentType, CommentDBType, CommentContentType
} from "../db/types";
import {bloggersCollection, commentsCollection} from "../db/db";
import {DeleteResult, FindCursor, ObjectId, UpdateResult} from "mongodb";

export const commentsRepository = {
  async findAll(searchPostComments: PostCommentsInputType):
    Promise<{ commentsSearchResult: CommentType[], commentsCount: number }> {

    const {postId, pageNumber = 1, pageSize = 10} = searchPostComments;
    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;


    const commentsCount = await commentsCollection.count({postId});
    const commentsSearch: CommentDBType[] = await commentsCollection
      .find({postId})
      .skip(skip).limit(limit)
      //.sort({addedAt: -1})
      .toArray();


    const commentsSearchResult: CommentType[] = commentsSearch.map((e: CommentDBType): CommentType => {
      const {_id, postId, ...rest} = e;
      return rest;
    })

    return {commentsSearchResult, commentsCount};
  },
  async create(comment: CommentType, postId: string): Promise<CommentType> {
    const resultComment: CommentDBType = {...comment, postId, _id: new ObjectId()}
    await commentsCollection.insertOne(resultComment);
    const result = await commentsCollection.findOne({id: comment.id}, {projection: {_id: 0, postId: 0}}) as CommentType;
    return result;
  },

  async findById(id: string): Promise<CommentType | null> {
    const result = await commentsCollection.findOne({id})
    if (result) {
      const {_id, postId, ...comment} = result
      return comment
    }
    return null
  },
  async delete(id: string) {
    const result: DeleteResult = await commentsCollection.deleteOne({id});
    if (result.deletedCount === 1) return true;
    return false;
  },
  async update(comment: CommentContentType, commentId: string) {
    debugger;
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
  }
}