import {ObjectId, WithId} from 'mongodb'
import {Request} from "express";

export class BloggerPaginatorInputType {
  constructor(
    public searchNameTerm: string | undefined,
    public pageNumber: number,
    public pageSize: number) {
  }
}

export class BloggerPaginatorType {
  constructor(
    public searchNameTerm: string | undefined,
    public skip: number,
    public limit: number) {
  }
}

export class BloggerType {
  constructor(public id: string,
              public name?: string,
              public youtubeUrl?: string) {
  }
}

export class BloggerDBType extends BloggerType {
  _id: ObjectId

  constructor(_id: ObjectId, id: string, name?: string, youtubeUrl?: string) {
    super(id, name, youtubeUrl);
    this._id = _id;
  }
}

export class SearchResultType<T> {
  constructor(public pagesCount: number,
              public page: number,
              public pageSize: number,
              public totalCount: number,
              public items: Array<T>) {
  }

}

export class PostPaginatorInputType {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public bloggerId?: string) {
  }
}

export class PostPaginatorType {
  constructor(
    public bloggerId: string | undefined,
    public skip: number,
    public limit: number,
  ) {
  }
}

export class PostCreateType {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public bloggerId: string) {
  }
}

export class PostUpdateType extends PostCreateType {
  id: string;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string) {

    super(title, shortDescription, content, bloggerId)
    this.id = id;
  }
}

export class PostInsertType extends PostUpdateType {
  bloggerName?: string;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string | undefined = undefined) {

    super(id, title, shortDescription, content, bloggerId)
    this.bloggerName = bloggerName;
  }
}

export class PostType extends PostInsertType {
  addedAt: string;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string | undefined = undefined,
    addedAt: string) {

    super(id, title, shortDescription, content, bloggerId, bloggerName)
    this.addedAt = addedAt;
  }
}

export class PostDBType extends PostType {
  _id: ObjectId;

  constructor(
    _id: ObjectId,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string | undefined = undefined,
    addedAt: string) {

    super(id, title, shortDescription, content, bloggerId, bloggerName, addedAt);
    this._id = _id;
  }
}

export class PostExtendedType extends PostType {
  extendedLikesInfo: ExtendedPostLikesInfoType;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string | undefined = undefined,
    addedAt: string,
    extendedLikesInfo: ExtendedPostLikesInfoType) {

    super(id, title, shortDescription, content, bloggerId, bloggerName, addedAt);
    this.extendedLikesInfo = extendedLikesInfo;
  }

}

// export type PostDBType = WithId<{
//   id: string,
//   title: string,
//   shortDescription: string,
//   content: string,
//   bloggerId: string,
//   bloggerName?: string,
//   addedAt: string
// }>

//export type PostType = Omit<PostDBType, "_id">
//export type PostExtendedType = PostType & { extendedLikesInfo: ExtendedPostLikesInfoType }

//export type PostCreateType = Omit<PostType, "id" | "bloggerName" | "addedAt">
//export type PostUpdateType = Omit<PostType, "bloggerName" | "addedAt">
//export type PostInsertType = Omit<PostType, "addedAt">

export class UserFullType {
  constructor(public id: string,
              public credentials: CredentialType,
              public token: TokenType,
              public createdAt: Date
  ) {
  }
}

export class UserDBType extends UserFullType {
  _id: ObjectId;

  constructor(_id: ObjectId,
              id: string,
              credentials: CredentialType,
              token: TokenType,
              createdAt: Date,
  ) {
    {
      super(id, credentials, token, createdAt);
      this._id = _id;
    }
  }
}

export class CredentialType {
  constructor(
    public login: string,
    public email: string,
    public password: string) {
  }
}

export class TokenType {
  constructor(
    public confirmationToken: string,
    public tokenStatus: TOKEN_STATUS,
    public tokenJWT: string,
  ) {
  }
}

export class UserShortType {
  constructor(
    public id: string,
    public login: string) {
  }
}

export class UserJWTType extends UserShortType {
  email: string;

  constructor(id: string, login: string, email: string) {
    super(id, login);
    this.email = email;
  }
}

export class LoginType {
  constructor(
    public login: string,
    public password: string
  ) {
  }
}

export class UserInputType {
  constructor(
    public pageNumber: number,
    public pageSize: number
  ) {
  }
}

export class JWTType {
  constructor(public accessToken: string) {
  }
}

export class PostCommentsInputType {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public postId: string
  ) {
  }
}

export class CommentsPaginatorType {
  constructor(
    public skip: number,
    public limit: number,
    public postId: string
  ) {
  }
}

export type CommentContentType = {
  content: string;
}

export class CommentType {
  constructor(
    public id: string,
    public userId: string,
    public content: string,
    public userLogin: string,
    public addedAt: Date,
  ) {
  }
}

export class CommentDBType extends CommentType {
  _id: ObjectId;
  postId: string;

  constructor(
    _id: ObjectId,
    id: string,
    userId: string,
    content: string,
    postId: string,
    userLogin: string,
    addedAt: Date) {

    super(id, userId, content, userLogin, addedAt);

    this._id = _id;
    this.postId = postId;
  }
}

export class CommentExtendedType extends CommentType {
  likesInfo: LikesInfoType;

  constructor(
    _id: ObjectId,
    id: string,
    userId: string,
    content: string,
    postId: string,
    userLogin: string,
    addedAt: Date,
    likesInfo: LikesInfoType) {

    super(id, userId, content, userLogin, addedAt);
    this.likesInfo = likesInfo;
  }
}

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

export class AttemptsType {
  constructor(
    public ip: string | null,
    public url: string | null,
    public method: string | null,
    public lastRequestsAt: Array<Date>,
  ) {
  }
}

export class AttemptsDBType extends AttemptsType {
  _id: ObjectId

  constructor(_id: ObjectId,
              ip: string | null,
              url: string | null,
              method: string | null,
              lastRequestsAt: Array<Date>,) {

    super(ip, url, method, lastRequestsAt);
    this._id = _id;
  }

}

export class PaginatorParamsType {
  constructor(public skip: number,
              public limit: number) {
  }
}

export class BlacklistType {
  constructor(
    public id: string,
    public refreshToken: string) {
  }
}

export class BlacklistDBType extends BlacklistType {
  _id: ObjectId;

  constructor(
    _id: ObjectId,
    id: string,
    refreshToken: string) {
    super(id, refreshToken);
    this._id = _id;
  }
}

export enum LIKE_STATUS {
  NONE = "None",
  LIKE = "Like",
  DISLIKE = "Dislike"
}

export class LikesInfoType {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: LIKE_STATUS
  ) {
  }
}

export class LikeUserDetailsInfoType {
  constructor(
    public addedAt: string,
    public userId: string | null,
    public login: string | null) {
  }
}

export class ExtendedPostLikesInfoType extends LikesInfoType {
  newestLikes: Array<LikeUserDetailsInfoType>

  constructor(likesCount: number,
              dislikesCount: number,
              myStatus: LIKE_STATUS,
              newestLikes: Array<LikeUserDetailsInfoType>) {
    super(likesCount, dislikesCount, myStatus);

    this.newestLikes = newestLikes;
  }
}

{
}

export class PostLikeType {
  constructor(
    public id: string,
    public postId: string,
    public userId: string | null,
    public login: string | null,
    public likeStatus: LIKE_STATUS,
    public addedAt: Date
  ) {
  }
}

export class PostLikeDBType extends PostLikeType {
  _id: ObjectId

  constructor(
    _id: ObjectId,
    id: string,
    postId: string,
    userId: string | null,
    login: string | null,
    likeStatus: LIKE_STATUS,
    addedAt: Date
  ) {
    super(id, postId, userId, login, likeStatus, addedAt);
    this._id = _id
  }
}

export class CommentLikeType {
  constructor(
    public id: string,
    public commentId: string,
    public userId: string | null,
    public likeStatus: LIKE_STATUS,
    public addedAt: Date
  ) {
  }
}

export class CommentLikeDBType extends CommentLikeType {
  _id: ObjectId;

  constructor(
    _id: ObjectId,
    id: string,
    commentId: string,
    userId: string | null,
    likeStatus: LIKE_STATUS,
    addedAt: Date
  ) {
    super(id, commentId, userId, likeStatus, addedAt)
    this._id = _id
  }
}
