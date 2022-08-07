import {
  CommentType, CommentContentType, UserType, PostCommentsInputType, SearchResultType
} from "../db/types";

import {v4 as uuidv4} from "uuid";
import {commentsRepository} from "../repositories/comments-repository";


export const commentsService = {

  async findAll(searchPostComments: PostCommentsInputType): Promise<SearchResultType<CommentType>> {

    if (!searchPostComments.pageNumber) searchPostComments.pageNumber = 1;
    if (!searchPostComments.pageSize) searchPostComments.pageSize = 10;

    const {commentsSearchResult, commentsCount} =
      await commentsRepository.findAll(searchPostComments);

    const result: SearchResultType<CommentType> = {
      pagesCount: Math.ceil(commentsCount / searchPostComments.pageSize),
      page: searchPostComments.pageNumber,
      pageSize: searchPostComments.pageSize,
      totalCount: commentsCount,
      items: commentsSearchResult
    }

    return result;

  },

  async create(commentContent: CommentContentType, user: UserType, postId: string): Promise<CommentType> {
    const comment: CommentType = {
      id: uuidv4(),
      content: commentContent.content,
      userId: user.id,
      userLogin: user.login,
      addedAt: new Date(),
    }
    return await commentsRepository.create(comment, postId)
  },

  async findById(id: string): Promise<CommentType | null>  {
    return await commentsRepository.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    return await commentsRepository.delete(id)
  },
  async update(comment: CommentContentType, commentId: string): Promise<boolean> {
    return await commentsRepository.update(comment, commentId);
  }
}