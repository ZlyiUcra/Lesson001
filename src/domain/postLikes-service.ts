import {LIKE_STATUS, PostLikeType, UserFullType} from "../db/types";
import {postLikesRepository} from "../repositories/postLikes-repository";
import {v4 as uuidv4} from "uuid";
import {correctLikeStatus} from "../helpers/likes/likesHelper";

export const postLikesService = {
  async upsert(postId: string, likeStatus: LIKE_STATUS, user: UserFullType | null): Promise<boolean> {
    const userId: string | null = user ? user.id : null;
    const login: string | null = user ? user.credentials.login : null;
    const localLikeStatus: LIKE_STATUS = user ? likeStatus : LIKE_STATUS.NONE;
    let postLike: PostLikeType | null = null;

    let savedPostLike = await this.findByPostIdAndUserId(postId, user?.id || null);

    if (savedPostLike) {
      postLike = {
        ...savedPostLike,
        likeStatus: localLikeStatus
      }
    } else {
      postLike = {
        id: uuidv4(),
        postId,
        likeStatus: localLikeStatus,
        userId,
        login,
        addedAt: new Date()
      }
    }
    return postLikesRepository.upsert(postLike);


    // let postLike: PostLikeType = {
    //   id: "",
    //   postId,
    //   likeStatus: LIKE_STATUS.NONE,
    //   userId,
    //   login,
    //   addedAt: new Date()
    // }

    // if (user) {
    //   postLike.userId = user.id;
    //   postLike.login = user.credentials.login;
    //   postLike.likeStatus = likeStatus;
    //   savedPostLike = await this.findByPostIdAndUserId(postId, user.id);
    //
    // } else {
    //   savedPostLike = await this.findByPostIdAndUserId(postId, null);
    // }
    // if (savedPostLike) {
    //   savedPostLike.likeStatus = correctLikeStatus(savedPostLike.likeStatus, likeStatus, user)
    //   postLike = {...savedPostLike, id: uuidv4()}
    // }
    //
    // return postLikesRepository.upsert(postLike);
    return false
  },
  async findByPostIdAndUserId(postId: string, userId: string | null): Promise<PostLikeType | null> {
    return postLikesRepository.findByPostIdAndUserId(postId, userId);
  },
  async findByIds(postIds: Array<string>): Promise<Array<PostLikeType>> {
    return postLikesRepository.findByIds(postIds);
  }
}