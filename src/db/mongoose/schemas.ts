import {Schema} from "mongoose";
import {
  AttemptsDBType,
  BlacklistType,
  BloggerDBType,
  CommentDBType, CommentLikeType, CredentialType, LIKE_STATUS,
  PostDBType, PostLikeType,
  TOKEN_STATUS, TokenType,
  UserDBType
} from "../types";
// const credentialsSchema = new Schema<CredentialType>({
//   login: {type: String, required: true},
//   email: String,
//   password: String
// })
//
// const tokenSchema = new Schema<TokenType>({
//   confirmationToken: String,
//   tokenStatus: {
//     type: String,
//     enum: TOKEN_STATUS,
//     default: TOKEN_STATUS.NONE
//   },
//   tokenJWT: String
// })

export const userSchema = new Schema<UserDBType>({
  id: String,
  credentials: {
    login: {type: String, required: true},
    email: String,
    password: String
  },
  token: {
    confirmationToken: String,
    tokenStatus: {
      type: String,
      enum: TOKEN_STATUS,
      default: TOKEN_STATUS.NONE
    },
    tokenJWT: String
  },
  createdAt: Date
});

export const bloggerSchema = new Schema<BloggerDBType>({
  id: String,
  name: {type: String, default: undefined},
  youtubeUrl: {type: String, default: undefined}
});

export const postSchema = new Schema<PostDBType>({
  id: String,
  title: String,
  shortDescription: String,
  content: String,
  bloggerId: String,
  bloggerName: {type: String, default: undefined},
  addedAt: String
});

export const commentSchema = new Schema<CommentDBType>({
  id: String,
  userId: String,
  content: String,
  postId: String,
  userLogin: String,
  addedAt: Date
});

export const attemptSchema = new Schema<AttemptsDBType>({
  ip: {type: String, default: null},
  url: {type: String, default: null},
  method: {type: String, default: null},
  lastRequestsAt: Array<Date>
});

export const blacklistSchema = new Schema<BlacklistType>({
  id: String,
  refreshToken: String
});

export const postLikeSchema = new Schema<PostLikeType>({
  id: String,
  postId: String,
  userId: {type: String, default: null},
  login: {type: String, default: null},
  likeStatus: {type: String, enum: LIKE_STATUS, default: LIKE_STATUS.NONE},
  addedAt: Date
})

export const commentLikeSchema = new Schema<CommentLikeType>({
  id: String,
  commentId: String,
  userId: {type: String, default: null},
  likeStatus: {type: String, enum: LIKE_STATUS, default: LIKE_STATUS.NONE},
  addedAt: Date
})
