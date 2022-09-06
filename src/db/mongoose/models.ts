import {model} from "mongoose";

import {
  attemptSchema,
  blacklistSchema,
  bloggerSchema,
  commentSchema,
  postLikesSchema,
  postSchema,
  userSchema
} from "./schemas";

export const userModel = model('users', userSchema);

export const bloggerModel = model('bloggers', bloggerSchema);

export const postModel = model('posts', postSchema);

export const commentModel = model('comments', commentSchema);

export const attemptModel = model('attempts', attemptSchema);

export const blacklistModel = model('blacklist', blacklistSchema);

export const postLikesModel = model('postLikes', postLikesSchema)