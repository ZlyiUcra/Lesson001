import "reflect-metadata";
import {CommentLikeType, LIKE_STATUS, UserFullType} from "../db/types";
import {v4 as uuidv4} from "uuid";
import {inject, injectable} from "inversify";
import {CommentLikesRepository} from "../repositories/commentLikes-repository";
import {TYPES} from "../db/iocTypes";

@injectable()
export class CommentLikesService {
  constructor(
    @inject<CommentLikesRepository>(TYPES.CommentLikesService) private commentLikesRepository: CommentLikesRepository
  ) {
  }

  async upsert(commentId: string, likeStatus: LIKE_STATUS, user: UserFullType | null): Promise<boolean> {

    const userId: string | null = user ? user.id : null;
    const localLikeStatus: LIKE_STATUS = user ? likeStatus : LIKE_STATUS.NONE;
    let commentLike: CommentLikeType | null = null;

    let savedCommentLike = await this.findByCommentIdAndUserId(commentId, user?.id || null);
    if (savedCommentLike) {
      commentLike = {
        ...savedCommentLike,
        likeStatus: localLikeStatus
      }
    } else {
      commentLike = {
        id: uuidv4(),
        commentId,
        likeStatus: localLikeStatus,
        userId,
        addedAt: new Date()
      }
    }
    return this.commentLikesRepository.upsert(commentLike);
  }

  async findByCommentIdAndUserId(commentId: string, userId: string | null): Promise<CommentLikeType | null> {
    return this.commentLikesRepository.findByCommentIdAndUserId(commentId, userId);
  }

  async findByIds(commentIds: Array<string>): Promise<Array<CommentLikeType>> {
    return this.commentLikesRepository.findByIds(commentIds);
  }
}
