import {WithId} from 'mongodb'
import {Request} from "express";

export type BloggerPaginatorInputType = {
  searchNameTerm?: string;
  pageNumber: number;
  pageSize: number;
}
export type BloggerPaginatorType = {
  searchNameTerm?: string;
  skip: number;
  limit: number;
}

export type BloggerDBType = WithId<{
  id: string,
  name?: string,
  youtubeUrl?: string
}>
export type BloggerType = Omit<BloggerDBType, "_id">

export type SearchResultType<T> = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: Array<T>
}

export type PostPaginatorInputType = {
  pageNumber: number;
  pageSize: number;
  bloggerId?: string;
}

export type PostPaginatorType = {
  bloggerId?: string;
  skip: number;
  limit: number;
}

export type PostDBType = WithId<{
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  bloggerId: string,
  bloggerName?: string,
  addedAt: Date
}>

export type PostType = Omit<PostDBType, "_id">
export type PostExtendedType = PostType & { extendedLikesInfo: ExtendedPostLikesInfoType }


export type PostCreateType = Omit<PostType, "id" | "bloggerName" | "addedAt">
export type PostUpdateType = Omit<PostType, "bloggerName" | "addedAt">
export type PostInsertType = Omit<PostType,  "addedAt">

export type UserDBType = WithId<{
  id: string;
  credentials: CredentialType;
  token: TokenType;
  createdAt: Date;
}>
export type CredentialType = {
  login: string;
  email: string;
  password: string;
};

export type TokenType = {
  confirmationToken: string;
  tokenStatus: TOKEN_STATUS;
  tokenJWT: string;
}
export type UserShortType = {
  id: string;
  login: string;
}
export type UserJWTType = UserShortType & { email: string };
export type UserFullType = Omit<UserDBType, "_id">

export type LoginType = {
  login: string;
  password: string;
}

export type UserInputType = {
  pageNumber: number;
  pageSize: number;
}

export type JWTType = {
  accessToken: string
}

export type PostCommentsInputType = {
  pageNumber: number;
  pageSize: number;
  postId: string;
}
export type CommentsPaginatorType = {
  skip: number;
  limit: number;
  postId: string;
}


export type CommentContentType = {
  content: string;
}
export type CommentDBType = WithId<{
  id: string;
  userId: string;
  content: string;
  postId: string;
  userLogin: string;
  addedAt: Date;
}>

export type CommentType = Omit<CommentDBType, "_id" | "postId">
export type CommentExtendedType = CommentType & { likesInfo: LikesInfoType };

export interface RequestWithShortUser extends Request {
  user?: UserShortType
}

export interface RequestWithFullUser extends Request {
  user?: UserFullType
}

export interface RequestWithInternetData extends Request {
  clientIP?: string | null;
  clientURL?: string | null;
}

export enum TOKEN_STATUS {
  NONE = "None",
  SENT = "Sent",
  RESENT = "Resent",
  CONFIRMED = "Confirmed"
}

export type AttemptsDBType = WithId<{
  ip: string | null;
  url: string | null;
  method: string | null;
  lastRequestsAt: Array<Date>;
}>
export type AttemptsType = Omit<AttemptsDBType, "_id">

export type PaginatorParamsType = {
  skip: number,
  limit: number
}

export type BlacklistDBType = WithId<{
  id: string;
  refreshToken: string;
}>

export type BlacklistType = Omit<BlacklistDBType, "_id">

export enum LIKE_STATUS {
  NONE = "None",
  LIKE = "Like",
  DISLIKE = "Dislike"
}

export type LikesInfoType = {
  likesCount: number,
  dislikesCount: number,
  myStatus: LIKE_STATUS
}
export type LikeUserDetailsInfoType = {
  addedAt: string,
  userId: string,
  login: string
}
export type ExtendedPostLikesInfoType = LikesInfoType & {
  newestLikes: Array<LikeUserDetailsInfoType>
}

export type PostLikeDBType = WithId<{
  id: string,
  postId: string,
  userId: string,
  login: string,
  likeStatus: LIKE_STATUS,
  addedAt: Date
}>

export type PostLikeType = Omit<PostLikeDBType, "_id">

export type CommentLikeDBType = WithId<{
  id: string,
  commentId: string,
  userId: string,
  likeStatus: LIKE_STATUS,
  addedAt: Date
}>

export type CommentLikeType = Omit<CommentLikeDBType, "_id">