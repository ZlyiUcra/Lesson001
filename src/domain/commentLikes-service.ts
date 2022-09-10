import {CommentLikeType, LIKE_STATUS, PostLikeType, UserFullType} from "../db/types";
import {commentLikesRepository} from "../repositories/commentLikes-repository";
import {v4 as uuidv4} from "uuid";
import {correctLikeStatus} from "../helpers/likes/likesHelper";

export const commentLikesService = {
  async upsert(commentId: string, likeStatus: LIKE_STATUS, user: UserFullType | null): Promise<boolean> {

    let userId: string | null = null;
    const localLikeStatus: LIKE_STATUS = user ? likeStatus : LIKE_STATUS.NONE;
    let commentLike: CommentLikeType | null = null;

    let savedCommentLike = await this.findByCommentIdAndUserId(commentId, user?.id || null);

    if (savedCommentLike) {
      commentLike = {
        ...savedCommentLike,
        likeStatus: localLikeStatus
      }
    } else {
      commentLike  = {
        id: uuidv4(),
        commentId,
        likeStatus: localLikeStatus,
        userId,
        addedAt: new Date()
      }
    }
    return commentLikesRepository.upsert(commentLike);

    // let commentLike: CommentLikeType = {
    //   id: uuidv4(),
    //   commentId,
    //   userId,
    //   likeStatus : LIKE_STATUS.NONE,
    //   addedAt: new Date()
    // }
    // if(user) {
    //   commentLike.userId = user.id;
    //   commentLike.likeStatus = likeStatus;
    //   savedCommentLike = await this.findByCommentIdAndUserId(commentId, user.id);
    // } else {
    //   savedCommentLike = await this.findByCommentIdAndUserId(commentId, null);
    // }
    // if (savedCommentLike) {
    //   savedCommentLike.likeStatus = correctLikeStatus(savedCommentLike.likeStatus, likeStatus, user)
    //   commentLike = {...savedCommentLike}
    // }
    //
    // return commentLikesRepository.upsert(commentLike);
  },
  async findByCommentIdAndUserId(commentId: string, userId: string | null): Promise<CommentLikeType | null> {
    return commentLikesRepository.findByCommentIdAndUserId(commentId, userId);
  },
  async findByIds(commentIds: Array<string>): Promise<Array<CommentLikeType>> {
    return commentLikesRepository.findByIds(commentIds);
  }
}