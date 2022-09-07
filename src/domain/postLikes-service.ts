import {LIKE_STATUS, PostLikeType, UserFullType} from "../db/types";
import {postLikesRepository} from "../repositories/postLikes-repository";
import {v4 as uuidv4} from "uuid";
import {correctLikeStatus} from "../helpers/likes/likesHelper";

export const postLikesService = {
  async upsert(postId: string, likeStatus: LIKE_STATUS, user: UserFullType): Promise<boolean> {
    let postLike: PostLikeType = {
      id: uuidv4(),
      postId,
      likeStatus,
      userId: user.id,
      login: user.credentials.login,
      addedAt: new Date()
    }

    const savedPostLike = await this.findByPostIdAndUserId(postId, user.id);

    if (savedPostLike) {
      savedPostLike.likeStatus = correctLikeStatus(savedPostLike.likeStatus, likeStatus)
      postLike = {...savedPostLike}
    }
    return postLikesRepository.upsert(postLike);
  },
  async findByPostIdAndUserId(postId: string, userId: string): Promise<PostLikeType | null> {
    return postLikesRepository.findByPostIdAndUserId(postId, userId);
  }
}