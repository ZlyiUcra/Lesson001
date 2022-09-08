import {
  CommentExtendedType,
  CommentLikeType, CommentType,
  ExtendedPostLikesInfoType,
  LIKE_STATUS, LikesInfoType,
  LikeUserDetailsInfoType,
  PostExtendedType,
  PostLikeType,
  PostType
} from "../../db/types";
import differenceInSeconds from "date-fns/differenceInSeconds";

export const correctLikeStatus = (oldLikeStatus: LIKE_STATUS, newLikeStatus: LIKE_STATUS): LIKE_STATUS => {
  if (oldLikeStatus === LIKE_STATUS.LIKE && newLikeStatus === LIKE_STATUS.DISLIKE ||
    oldLikeStatus === LIKE_STATUS.DISLIKE && newLikeStatus === LIKE_STATUS.LIKE) {
    return LIKE_STATUS.NONE
  }
  return newLikeStatus

}

export const newest3LikesElements = (postLikes: Array<PostLikeType>, postId: string) => {
  const newestLikes: Array<LikeUserDetailsInfoType> =

    postLikes.filter((pl: PostLikeType) => pl.likeStatus !== LIKE_STATUS.NONE && pl.postId === postId)
      .sort((a, b) => -differenceInSeconds(a.addedAt, b.addedAt))
      .slice(0, 3)
      .map((pl: PostLikeType) => {
        return {
          addedAt: pl.addedAt.toString(),
          userId: pl.userId,
          login: pl.login
        }
      })
  return newestLikes;
}

export const getPostMyStatus = (postLikes: Array<PostLikeType>, postId: string, userId: string): LIKE_STATUS => {
  const myStatusPostLike = postLikes.find((pl: PostLikeType) => pl.postId === postId && pl.userId === userId)
  const myStatus = myStatusPostLike ? myStatusPostLike.likeStatus : LIKE_STATUS.NONE;
  return myStatus;
}
export const getPostDislikesCount = (postLikes: Array<PostLikeType>, postId: string): number => {
  const dislikesCount = postLikes.filter((pl: PostLikeType) => pl.postId === postId && pl.likeStatus === LIKE_STATUS.DISLIKE).length;
  return dislikesCount;
}
export const getPostLikesCount = (postLikes: Array<PostLikeType>, postId: string): number => {
  const likesCount = postLikes.filter((pl: PostLikeType) => pl.postId === postId && pl.likeStatus === LIKE_STATUS.LIKE).length;
  return likesCount;
}
export const getPostExtendedElement = (post: PostType, postLikes: Array<PostLikeType>, userId: string): PostExtendedType => {
  const likesCount: number = getPostLikesCount(postLikes, post.id);
  const dislikesCount: number = getPostDislikesCount(postLikes, post.id);
  const myStatus: LIKE_STATUS = getPostMyStatus(postLikes, post.id, userId);
  const newestLikes: Array<LikeUserDetailsInfoType> = newest3LikesElements(postLikes, post.id);

  const extendedLikesInfo: ExtendedPostLikesInfoType = {
    likesCount,
    dislikesCount,
    myStatus,
    newestLikes
  }
  return {
    ...post,
    extendedLikesInfo
  }
}

export const getCommentMyStatus = (commentLikes: Array<CommentLikeType>, commentId: string, userId: string): LIKE_STATUS => {
  const myStatusPostLike = commentLikes.find((pl: CommentLikeType) => pl.commentId === commentId && pl.userId === userId)
  const myStatus = myStatusPostLike ? myStatusPostLike.likeStatus : LIKE_STATUS.NONE;
  return myStatus;
}
export const getCommentDislikesCount = (commentLikes: Array<CommentLikeType>, commentId: string): number => {
  const dislikesCount = commentLikes.filter((pl: CommentLikeType) => pl.commentId === commentId && pl.likeStatus === LIKE_STATUS.DISLIKE).length;
  return dislikesCount;
}
export const getCommentLikesCount = (commentLikes: Array<CommentLikeType>, commentId: string): number => {
  const likesCount = commentLikes.filter((pl: CommentLikeType) => pl.commentId === commentId && pl.likeStatus === LIKE_STATUS.LIKE).length;
  return likesCount;
}
export const getCommentExtendedElement = (comment: CommentType, commentLikes: Array<CommentLikeType>, userId: string): CommentExtendedType => {
  const likesCount: number = getCommentLikesCount(commentLikes, comment.id);
  const dislikesCount: number = getCommentDislikesCount(commentLikes, comment.id);
  const myStatus: LIKE_STATUS = getCommentMyStatus(commentLikes, comment.id, userId);

  const likesInfo: LikesInfoType = {
    likesCount,
    dislikesCount,
    myStatus
  }
  return {
    ...comment,
    likesInfo
  }
}