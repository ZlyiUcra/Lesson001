import {PostsLikesType} from "../db/types";
import {postLikesModel} from "../db/mongoose/models";
import {postLikesRepository} from "../repositories/postLikes-repository";

export const postLikesService = {
  async upsert(postLike: PostsLikesType): Promise<boolean> {
    return postLikesRepository.upsert(postLike);
  }
}