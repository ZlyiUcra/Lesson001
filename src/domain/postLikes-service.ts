import "reflect-metadata";
import {LIKE_STATUS, PostLikeType, UserFullType} from "../db/types";
import {v4 as uuidv4} from "uuid";
import {inject, injectable} from "inversify";
import {PostLikesRepository} from "../repositories/postLikes-repository";
import {TYPES} from "../db/iocTypes";

@injectable()
export class PostLikesService {
  constructor(
    @inject<PostLikesRepository>(TYPES.PostLikesRepository) private postLikesRepository: PostLikesRepository
  ) {
  }
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
    return this.postLikesRepository.upsert(postLike);

  }

  async findByPostIdAndUserId(postId: string, userId: string | null): Promise<PostLikeType | null> {
    return this.postLikesRepository.findByPostIdAndUserId(postId, userId);
  }

  async findByIds(postIds: Array<string>): Promise<Array<PostLikeType>> {
    return this.postLikesRepository.findByIds(postIds);
  }
}
