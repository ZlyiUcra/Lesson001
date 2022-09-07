import {LIKE_STATUS} from "../../db/types";

export const correctLikeStatus = (oldLikeStatus: LIKE_STATUS, newLikeStatus: LIKE_STATUS): LIKE_STATUS => {
  if (oldLikeStatus === LIKE_STATUS.LIKE && newLikeStatus === LIKE_STATUS.DISLIKE ||
    oldLikeStatus === LIKE_STATUS.DISLIKE && newLikeStatus === LIKE_STATUS.LIKE) {
    return LIKE_STATUS.NONE
  }
  return newLikeStatus

}