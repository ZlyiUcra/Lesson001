import {
  CommentExtendedType,
  CommentLikeType, CommentType,
  ExtendedPostLikesInfoType,
  LIKE_STATUS, LikesInfoType,
  LikeUserDetailsInfoType,
  PostExtendedType,
  PostLikeType,
  PostType, UserFullType
} from "../../db/types";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";
import {jwtUtility} from "../../application/jwt-utility";
import {usersService} from "../../domain/users-services";

export const correctLikeStatus = (oldLikeStatus: LIKE_STATUS, newLikeStatus: LIKE_STATUS, user: UserFullType | null): LIKE_STATUS => {
  // if (!user || (oldLikeStatus === LIKE_STATUS.LIKE && newLikeStatus === LIKE_STATUS.LIKE) ||
  //   (oldLikeStatus === LIKE_STATUS.DISLIKE && newLikeStatus === LIKE_STATUS.DISLIKE)) {
  //   return LIKE_STATUS.NONE
  // }
  // if (newLikeStatus === LIKE_STATUS.NONE) {
  //   return oldLikeStatus;
  // }
  if (!user) {
    return LIKE_STATUS.NONE
  }
  //else if (newLikeStatus === LIKE_STATUS.NONE) {
  //   return oldLikeStatus;
  // }
  return newLikeStatus

}

export const newest3LikesElements = (postLikes: Array<PostLikeType>, postId: string) => {
  const newestLikes: Array<LikeUserDetailsInfoType> =

    postLikes.filter((pl: PostLikeType) => pl.likeStatus === LIKE_STATUS.LIKE && pl.postId === postId && pl.userId)
      .sort((a, b) => differenceInMilliseconds(b.addedAt, a.addedAt))
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
  //if (!userId) return LIKE_STATUS.NONE

  const myStatusPostLike = postLikes.find((pl: PostLikeType) => pl.postId === postId && pl.userId === userId);
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
  //if (!userId) return LIKE_STATUS.NONE

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


export const likesAuthValidator = async (headerAuthorization: string | undefined) => {
  const headerAuth = headerAuthorization;
  const accessToken = headerAuth?.split(" ")[1] || "";
  const isBearer = headerAuth?.split(" ")[0].trim() === "Bearer" && accessToken.split(".").length === 3;
  let userJWT = await jwtUtility.extractUserJWTFromToken(accessToken);

  const user = await usersService.findById(userJWT?.id as string);
  console.log("likesAuthValidator: ",
    "\n1.", headerAuth,
    "\n2.", accessToken,
    "\n3.", userJWT,
    "\n4.", user,
    "\n5.", isBearer)
  return {headerAuth, accessToken, userJWT, user, isBearer}
}