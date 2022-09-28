import "reflect-metadata";
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
import {CommentsRepository} from "../repositories/comments-repository";
import {getCommentExtendedElement} from "../helpers/likes/likesHelper";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import {CommentLikesService} from "./commentLikes-service";

@injectable()
export class CommentsService {
  constructor(
    @inject<CommentsRepository>(TYPES.CommentsRepository) private commentsRepository: CommentsRepository,
    @inject<CommentLikesService>(TYPES.CommentLikesService) private commentLikesService: CommentLikesService
  ) {
  }
  async getAll(searchPostComments: PostCommentsInputType, userId: string = ""): Promise<SearchResultType<CommentExtendedType>> {
    const {pageNumber, pageSize, postId} = searchPostComments;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const commentsPaginator: CommentsPaginatorType = {postId, skip, limit};

    const {commentsSearch, commentsCount} =
      await this.commentsRepository.getAll(commentsPaginator);

    const commentIds: Array<string> = commentsSearch.map((c: CommentType) => c.id);
    const commentLikes: Array<CommentLikeType> = await this.commentLikesService.findByIds(commentIds);

    const commentsSearchExtended: Array<CommentExtendedType> = commentsSearch.map((comment: CommentType) => getCommentExtendedElement(comment, commentLikes, userId))
    //getCommentExtendedElement
    const result = new SearchResultType<CommentExtendedType>(
      Math.ceil(commentsCount / pageSize),
      pageNumber,
      pageSize,
      commentsCount,
      commentsSearchExtended)

    return result;

  }

  async create(commentContent: CommentContentType, user: UserShortType, postId: string): Promise<CommentExtendedType> {
    const comment: CommentType = {
      id: uuidv4(),
      content: commentContent.content,
      userId: user.id,
      userLogin: user.login,
      addedAt: new Date(),
    }

    const commentReturned = await this.commentsRepository.create(comment, postId);
    const commentLikes = await this.commentLikesService.findByIds([commentReturned.id]);
    const commentExtended = getCommentExtendedElement(commentReturned, commentLikes, user.id);

    return commentExtended;
  }

  async findById(id: string, userId: string = ""): Promise<CommentExtendedType | null> {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) return null;
    const commentLikes = await this.commentLikesService.findByIds([comment.id]);
    const commentExtended = getCommentExtendedElement(comment, commentLikes, userId);
    return commentExtended;
  }

  async update(comment: CommentContentType, commentId: string): Promise<boolean> {
    return await this.commentsRepository.update(comment, commentId);
  }

  async delete(id: string): Promise<boolean> {
    return await this.commentsRepository.delete(id)
  }

  async likeStatus(commentId: string, likeStatus: LIKE_STATUS, user: UserFullType | undefined): Promise<boolean> {

    return await this.commentLikesService.upsert(commentId, likeStatus, user || null);

  }
}

//export const commentsService = new CommentsService()