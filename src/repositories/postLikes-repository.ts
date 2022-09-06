import {PostsLikesType} from "../db/types";
import {postLikesModel} from "../db/mongoose/models";
import {UpdateResult} from "mongodb";

export const postLikesRepository = {

  async upsert(postLike: PostsLikesType): Promise<boolean> {
    const result: UpdateResult = await postLikesModel.updateOne({id: postLike.id}, {$set: postLike}, {upsert: true});

    if(result.upsertedCount === 1){
      return true
    }
    return false
  }
}