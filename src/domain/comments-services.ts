import {
  CommentType,
  CommentContentType,
  PostCommentsInputType,
  SearchResultType,
  UserShortType,
  CommentsPaginatorType,
  LIKE_STATUS, UserFullType, CommentLikeType
} from "../db/types";

import {v4 as uuidv4} from "uuid";
import {commentsRepository} from "../repositories/comments-repository";
import {commentLikesService} from "./commentLikes-service";


export const commentsService = {

  async getAll(searchPostComments: PostCommentsInputType): Promise<SearchResultType<CommentType>> {
    const {pageNumber, pageSize, postId} = searchPostComments;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const commentsPaginator: CommentsPaginatorType = {postId, skip, limit};

    const {commentsSearch, commentsCount} =
      await commentsRepository.getAll(commentsPaginator);

    const result: SearchResultType<CommentType> = {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: commentsCount,
      items: commentsSearch
    }

    return result;

  },

  async create(commentContent: CommentContentType, user: UserShortType, postId: string): Promise<CommentType> {
    const comment: CommentType = {
      id: uuidv4(),
      content: commentContent.content,
      userId: user.id,
      userLogin: user.login,
      addedAt: new Date(),
    }

    return await commentsRepository.create(comment, postId)
  },

  async findById(id: string): Promise<CommentType | null> {
    return await commentsRepository.findById(id);
  },
  async update(comment: CommentContentType, commentId: string): Promise<boolean> {
    return await commentsRepository.update(comment, commentId);
  },

  async delete(id: string): Promise<boolean> {
    return await commentsRepository.delete(id)
  },
  async likeStatus(commentId: string, likeStatus: LIKE_STATUS, user: UserFullType | undefined): Promise<boolean> {
    if (!user) return false;

    return await commentLikesService.upsert(commentId, likeStatus, user);

  }
}