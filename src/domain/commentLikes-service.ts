import {CommentLikeType, LIKE_STATUS, UserFullType} from "../db/types";
import {commentLikesRepository} from "../repositories/commentLikes-repository";
import {v4 as uuidv4} from "uuid";
import {correctLikeStatus} from "../helpers/likes/likesHelper";

export const commentLikesService = {
  async upsert(commentId: string, likeStatus: LIKE_STATUS, user: UserFullType): Promise<boolean> {

    let commentLike: CommentLikeType = {
      id: uuidv4(),
      commentId,
      userId: user.id,
      likeStatus,
      addedAt: new Date()
    }
    const savedCommentLike = await this.findByCommentIdAndUserId(commentId, user.id);
    if (savedCommentLike) {
      savedCommentLike.likeStatus = correctLikeStatus(savedCommentLike.likeStatus, likeStatus)
      commentLike = {...savedCommentLike}
    }
    return commentLikesRepository.upsert(commentLike);
  },
  async findByCommentIdAndUserId(commentId: string, userId: string): Promise<CommentLikeType | null> {
    return commentLikesRepository.findByCommentIdAndUserId(commentId, userId);
  },
  async findByIds(commentIds:Array<string>): Promise<Array<CommentLikeType>> {
    return commentLikesRepository.findByIds(commentIds);
  }
}