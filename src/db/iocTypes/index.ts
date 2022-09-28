import {TestingRepository} from "../../repositories/testing-repository";
import {TestingServices} from "../../domain/testing-service";

export const TYPES = {
  //user and auth with derivatives
  UsersRepository: Symbol.for("UsersRepository"),
  UsersService: Symbol.for("UsersService"),
  UsersController: Symbol.for("UsersController"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),
  AuthHelperService: Symbol.for("AuthHelperService"),
  JwtUtility: Symbol.for("JwtUtility"),
  EmailAdapter: Symbol.for("EmailAdapter"),
  userModel: Symbol.for("userModel"),
  EmailMessage: Symbol.for("EmailMessage"),
  // attempts and derivatives
  attemptModel: Symbol.for("attemptModel"),
  AttemptsRepository: Symbol.for("AttemptsRepository"),
  AttemptsService: Symbol.for("AttemptsService"),
  // blacklist
  blacklistModel: Symbol.for("blacklistModel"),
  BlacklistRepository: Symbol.for("BlacklistRepository"),
  BlacklistService: Symbol.for("BlacklistService"),
  //posts
  postModel: Symbol.for("postModel"),
  PostsRepository: Symbol.for("PostsRepository"),
  PostsServices: Symbol.for("PostsServices"),
  PostsController: Symbol.for("PostsController"),
  //postLikes
  PostLikesRepository: Symbol.for("PostLikesRepository"),
  PostLikesService: Symbol.for("PostLikesService"),
  postLikeModel: Symbol.for("postLikeModel"),
  // bloggers
  bloggerModel: Symbol.for("bloggerModel"),
  BloggersRepository: Symbol.for("BloggersRepository"),
  BloggersService: Symbol.for("BloggersService"),
  BloggersController: Symbol.for("BloggersController"),
  // comments
  commentModel: Symbol.for("commentModel"),
  CommentsRepository: Symbol.for("CommentsRepository"),
  CommentsService: Symbol.for("CommentsService"),
  CommentsController: Symbol.for("CommentsController"),
  //commentLikes
  CommentLikesRepository: Symbol.for("CommentLikesRepository"),
  CommentLikesService: Symbol.for("CommentLikesService"),
  commentLikeModel: Symbol.for("commentLikeModel"),
  // testing
  TestingRepository: Symbol.for("TestingRepository"),
  TestingServices: Symbol.for("TestingServices"),
  TestingController: Symbol.for("TestingController")

};