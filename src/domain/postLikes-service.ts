import {LIKE_STATUS, PostLikeType, UserFullType} from "../db/types";
import {postLikesRepository} from "../repositories/postLikes-repository";
import {v4 as uuidv4} from "uuid";
import {correctLikeStatus} from "../helpers/likes/likesHelper";

export const postLikesService = {
  async upsert(postId: string, likeStatus: LIKE_STATUS, user: UserFullType | null): Promise<boolean> {
    let userId: string | null = null;
    let login: string | null = null;
    let savedPostLike: PostLikeType | null = null;

    let postLike: PostLikeType = {
      id: uuidv4(),
      postId,
      likeStatus: likeStatus,
      userId,
      login,
      addedAt: new Date()
    }

    if (user) {
      postLike.userId = user.id;
      postLike.login = user.credentials.login;
      savedPostLike = await this.findByPostIdAndUserId(postId, user.id);

    } else {
      savedPostLike = await this.findByPostIdAndUserId(postId, null);
    }
    if (savedPostLike) {
      savedPostLike.likeStatus = correctLikeStatus(savedPostLike.likeStatus, likeStatus,user)
      postLike = {...savedPostLike}
    }

    return postLikesRepository.upsert(postLike);
  },
  async findByPostIdAndUserId(postId: string, userId: string | null): Promise<PostLikeType | null> {
    return postLikesRepository.findByPostIdAndUserId(postId, userId);
  },
  async findByIds(postIds: Array<string>): Promise<Array<PostLikeType>> {
    return postLikesRepository.findByIds(postIds);
  }
}