import "reflect-metadata";
import {Container} from "inversify";
import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {AuthService} from "../domain/auth-services";
import {JwtUtility} from "../application/jwt-utility";
import {UsersController} from "../controllers/users-controller";
import {AuthController} from "../controllers/auth-controller";
import {EmailAdapter} from "../adapters/email-adapter";
import {
  attemptModel,
  blacklistModel,
  bloggerModel,
  commentLikeModel,
  commentModel, postLikeModel,
  postModel,
  userModel
} from "../db/mongoose/models";
import {
  AttemptsDBType,
  BlacklistType,
  BloggerDBType,
  CommentDBType,
  CommentLikeType,
  PostDBType, PostLikeType,
  UserDBType
} from "../db/types";
import mongoose from "mongoose";
import {TYPES} from "../db/iocTypes";
import {AuthHelperService} from "../domain/auth-helper-service";
import {EmailMessage} from "../adapters/email-message";
import {AttemptsRepository} from "../repositories/attempts-repository";
import {AttemptsService} from "../domain/attempts-service";
import {BlacklistRepository} from "../repositories/blacklist-repository";
import {BlacklistService} from "../domain/blacklist-service";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {BloggersService} from "../domain/bloggers-services";
import {PostsRepository} from "../repositories/posts-repository";
import {BloggersController} from "../controllers/bloggers-controller";
import {PostsServices} from "../domain/posts-services";
import {PostsController} from "../controllers/posts-controller";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsService} from "../domain/comments-services";
import {CommentsController} from "../controllers/comments-controller";
import {CommentLikesRepository} from "../repositories/commentLikes-repository";
import {CommentLikesService} from "../domain/commentLikes-service";
import {PostLikesService} from "../domain/postLikes-service";
import {PostLikesRepository} from "../repositories/postLikes-repository";
import {TestingRepository} from "../repositories/testing-repository";
import {TestingServices} from "../domain/testing-service";
import {TestingController} from "../controllers/testing-controller";
import { LikesAuthValidator } from "../helpers/likes/LikesAuthValidator";

export const rootContainer = new Container();

// users and auth
rootContainer.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository);
rootContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
rootContainer.bind<UsersService>(TYPES.UsersService).to(UsersService);
rootContainer.bind<mongoose.Model<UserDBType>>(TYPES.userModel).toConstantValue(userModel);
rootContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
rootContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
rootContainer.bind<AuthHelperService>(TYPES.AuthHelperService).to(AuthHelperService);
rootContainer.bind<JwtUtility>(TYPES.JwtUtility).to(JwtUtility);
rootContainer.bind<EmailAdapter>(TYPES.EmailAdapter).to(EmailAdapter);
rootContainer.bind<EmailMessage>(TYPES.EmailMessage).to(EmailMessage);
// attempts
rootContainer.bind<AttemptsRepository>(TYPES.AttemptsRepository).to(AttemptsRepository);
rootContainer.bind<AttemptsService>(TYPES.AttemptsService).to(AttemptsService);
rootContainer.bind<mongoose.Model<AttemptsDBType>>(TYPES.attemptModel).toConstantValue(attemptModel);
// blacklist
rootContainer.bind<BlacklistRepository>(TYPES.BlacklistRepository).to(BlacklistRepository);
rootContainer.bind<BlacklistService>(TYPES.BlacklistService).to(BlacklistService);
rootContainer.bind<mongoose.Model<BlacklistType>>(TYPES.blacklistModel).toConstantValue(blacklistModel);
// posts
rootContainer.bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository);
rootContainer.bind<PostsServices>(TYPES.PostsServices).to(PostsServices);
rootContainer.bind<PostsController>(TYPES.PostsController).to(PostsController);
rootContainer.bind<mongoose.Model<PostDBType>>(TYPES.postModel).toConstantValue(postModel);
// postLikes
rootContainer.bind<PostLikesRepository>(TYPES.PostLikesRepository).to(PostLikesRepository);
rootContainer.bind<PostLikesService>(TYPES.PostLikesService).to(PostLikesService);
rootContainer.bind<mongoose.Model<PostLikeType>>(TYPES.postLikeModel).toConstantValue(postLikeModel)
// bloggers
rootContainer.bind<BloggersRepository>(TYPES.BloggersRepository).to(BloggersRepository);
rootContainer.bind<BloggersService>(TYPES.BloggersService).to(BloggersService);
rootContainer.bind<BloggersController>(TYPES.BloggersController).to(BloggersController);
rootContainer.bind<mongoose.Model<BloggerDBType>>(TYPES.bloggerModel).toConstantValue(bloggerModel);
// comments
rootContainer.bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository);
rootContainer.bind<CommentsService>(TYPES.CommentsService).to(CommentsService);
rootContainer.bind<CommentsController>(TYPES.CommentsController).to(CommentsController);
rootContainer.bind<mongoose.Model<CommentDBType>>(TYPES.commentModel).toConstantValue(commentModel);
// commentsLikes
rootContainer.bind<CommentLikesRepository>(TYPES.CommentLikesRepository).to(CommentLikesRepository);
rootContainer.bind<CommentLikesService>(TYPES.CommentLikesService).to(CommentLikesService);
rootContainer.bind<mongoose.Model<CommentLikeType>>(TYPES.commentLikeModel).toConstantValue(commentLikeModel)

// testing
rootContainer.bind<TestingRepository>(TYPES.TestingRepository).to(TestingRepository);
rootContainer.bind<TestingServices>(TYPES.TestingServices).to(TestingServices);
rootContainer.bind<TestingController>(TYPES.TestingController).to(TestingController);

//middleware
rootContainer.bind<LikesAuthValidator>(TYPES.LikesAuthValidator).to(LikesAuthValidator)
