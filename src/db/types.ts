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
  bloggerName?: string
}>

export type PostType = Omit<PostDBType, "_id">

export type PostCreateType = Omit<PostType, "id" | "bloggerName">
export type PostUpdateType = Omit<PostType, "bloggerName">

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
  token: string
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

export interface RequestWithUser extends Request {
  user?: UserShortType
}

export interface RequestWithInternetData extends Request {
  clientIP?: string | null;
  clientURL?: string | null;
}

export enum TOKEN_STATUS {
  SENT = "Sent",
  RESENT = "Resent",
  CONFIRMED = "Confirmed"
}

export type AttemptsDBType = WithId<{
  ip: string | null;
  url: string | null;
  method: string | null;
  limitTimeCount: number;
  lastRequestedAt: Date;
}>
export type AttemptsType = Omit<AttemptsDBType, "_id">

export type PaginatorParamsType = {
  skip: number,
  limit: number
}