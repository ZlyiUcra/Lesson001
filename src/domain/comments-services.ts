import {
  CommentType,
  CommentContentType,
  PostCommentsInputType,
  SearchResultType,
  UserShortType,
  CommentsPaginatorType,
  LIKE_STATUS, UserFullType, CommentLikeType, CommentExtendedType
} from "../db/types";

import {v4 as uuidv4} from "uuid";
import {commentsRepository} from "../repositories/comments-repository";
import {commentLikesService} from "./commentLikes-service";
import {getCommentExtendedElement} from "../helpers/likes/likesHelper";


export const commentsService = {

  async getAll(searchPostComments: PostCommentsInputType, userId: string = ""): Promise<SearchResultType<CommentExtendedType>> {
    const {pageNumber, pageSize, postId} = searchPostComments;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const commentsPaginator: CommentsPaginatorType = {postId, skip, limit};

    const {commentsSearch, commentsCount} =
      await commentsRepository.getAll(commentsPaginator);

    const commentIds: Array<string> = commentsSearch.map((c: CommentType) => c.id);
    const commentLikes: Array<CommentLikeType> = await  commentLikesService.findByIds(commentIds);

    const commentsSearchExtended: Array<CommentExtendedType> = commentsSearch.map((comment: CommentType) => getCommentExtendedElement(comment, commentLikes, userId))
    //getCommentExtendedElement
    const result: SearchResultType<CommentExtendedType> = {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: commentsCount,
      items: commentsSearchExtended
    }

    return result;

  },

  async create(commentContent: CommentContentType, user: UserShortType, postId: string): Promise<CommentExtendedType> {
    const comment: CommentType = {
      id: uuidv4(),
      content: commentContent.content,
      userId: user.id,
      userLogin: user.login,
      addedAt: new Date(),
    }

    const commentReturned =  await commentsRepository.create(comment, postId);
    const commentLikes = await commentLikesService.findByIds([commentReturned.id]);
    const commentExtended = getCommentExtendedElement(commentReturned, commentLikes, user.id);

    return commentExtended;
  },

  async findById(id: string, userId: string = ""): Promise<CommentExtendedType | null> {
    const comment = await commentsRepository.findById(id);
    if(!comment) return null;
    const commentLikes = await commentLikesService.findByIds([comment.id]);
    const commentExtended = getCommentExtendedElement(comment, commentLikes, userId);
    return commentExtended;
  },
  async update(comment: CommentContentType, commentId: string): Promise<boolean> {
    return await commentsRepository.update(comment, commentId);
  },

  async delete(id: string): Promise<boolean> {
    return await commentsRepository.delete(id)
  },
  async likeStatus(commentId: string, likeStatus: LIKE_STATUS, user: UserFullType | undefined): Promise<boolean> {

    return await commentLikesService.upsert(commentId, likeStatus, user || null);

  }
}