import {WithId} from 'mongodb'
import {Request} from "express";

export type BloggerPaginatorInputType = {
  searchNameTerm?: string;
  pageNumber: number;
  pageSize: number;
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


export type PostDBType = WithId<{
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  bloggerId: string,
  bloggerName?: string
}>

export type PostType = Omit<PostDBType, "_id">

export type ShortPostType = Omit<PostType, "id" | "bloggerName">

export type ProductDBType = WithId<{
  id: string;
  title: string;
  addedAt: Date;
}>
export type ProductType = Omit<ProductDBType, "_id">

export type UserDBType = WithId<{
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}>
export type UserWithHashedPasswordType = Omit<UserDBType, "_id">

export type UserType = Omit<UserDBType, "_id" | "passwordHash" | "createdAt">

export type LoginType = {
  login: string;
  password: string;
}

export type UserInputType = {
  pageNumber: number;
  pageSize: number;
}
export type CredentialType = LoginType & {email: string};

export type JWTType = {
  token: string
}

export type PostCommentsInputType = {
  pageNumber: number;
  pageSize: number;
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


export type TokenDBType = WithId<{
  id: string;
  userId: string;
  ip: string | null;
  limitTimeCount: number;
  confirmationToken: string;
  createdAt: Date;
  lastRequestedAt: Date;
  tokenStatus: TOKEN_STATUS;
  tokenJWT: string;
}>

export type TokenType = Omit<TokenDBType, "_id">

export interface RequestWithUser extends Request {
  user?: UserType
}

export interface  RequestWithIP extends Request {
  clientIP?: string | null;
}
export enum TOKEN_STATUS {
  SENT= "Sent",
  RESENT="Resent",
  CONFIRMED= "Confirmed"
}