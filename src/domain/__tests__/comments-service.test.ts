import {CommentsRepository} from "../../repositories/comments-repository";
import {
  bloggerModel,
  commentLikeModel,
  commentModel,
  postLikeModel,
  postModel,
  userModel
} from "../../db/mongoose/models";
import {CommentLikesService} from "../commentLikes-service";
import {CommentLikesRepository} from "../../repositories/commentLikes-repository";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UsersRepository} from "../../repositories/users-repository";
import {AuthHelperService} from "../auth-helper-service";
import {UsersService} from "../users-service";
import {
  BloggerType,
  CommentContentType,
  CommentExtendedType,
  CredentialType,
  LIKE_STATUS,
  PostCreateType,
  PostType,
  UserFullType
} from "../../db/types";
import {PostsRepository} from "../../repositories/posts-repository";
import {BloggersRepository} from "../../repositories/bloggers-repository";
import {PostLikesRepository} from "../../repositories/postLikes-repository";
import {PostLikesService} from "../postLikes-service";
import {PostsServices} from "../posts-services";
import {BloggersService} from "../bloggers-services";
import {CommentsService} from "../comments-services";
import {v4 as uuidv4} from "uuid";

describe("integration test for bloggers service", () => {
  const commentsRepository = new CommentsRepository(commentModel);
  const commentLikesRepository = new CommentLikesRepository(commentLikeModel);
  const commentLikesService = new CommentLikesService(commentLikesRepository);

  const commentsService = new CommentsService(commentsRepository, commentLikesService);
  let comment: CommentExtendedType;

  // users section
  const usersRepository = new UsersRepository(userModel);
  const authHelperService = new AuthHelperService();
  const usersService = new UsersService(usersRepository, authHelperService);
  const email = "test@test.com";
  const login = "login";
  const password = "12345";
  const userCredentials = new CredentialType(login, email, password);
  let user: UserFullType;

  // post section
  const postsRepository: PostsRepository = new PostsRepository(postModel);
  const bloggersRepository = new BloggersRepository(bloggerModel);

  const postLikesRepository = new PostLikesRepository(postLikeModel);
  const postLikesService = new PostLikesService(postLikesRepository);

  const postsServices = new PostsServices(postsRepository, bloggersRepository, postLikesService);
  let postCreatedType: PostCreateType;
  let post: PostType;
  const commentContentType: CommentContentType = {
    content: "comment content"
  }

  // blogger section
  const bloggerName = "Blogger name";
  const youtubeUrl = "www.youtube.com/link"
  let blogger: BloggerType;
  const bloggersService = new BloggersService(bloggersRepository);

  // mongoServer
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    user = await usersService.create(userCredentials);
    blogger = await bloggersService.create(bloggerName, youtubeUrl);
    const postCreatedType = {
      title: "posts title",
      shortDescription: "post description",
      content: "post content",
      bloggerId: blogger.id
    };
    post = await postsServices.create(postCreatedType, user.id);

  });
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  });
  describe("comments service", () => {
    it("should return created comment", async () => {
      comment = await commentsService.create(commentContentType, {id: user.id, login: user.credentials.login}, post.id);
      expect(comment).toBeTruthy()
    });
    it("should return all comments", async () => {
      const postCommentsInputType = {
        pageNumber: 1,
        pageSize: 10,
        postId: post.id
      }
      const comments = await commentsService.getAll(postCommentsInputType, user.id);

      expect(comments).toBeTruthy()
    });
    it("should return all comments without userId", async () => {
      const postCommentsInputType = {
        pageNumber: 1,
        pageSize: 10,
        postId: post.id
      }
      const comments = await commentsService.getAll(postCommentsInputType);

      expect(comments).toBeTruthy()
    });
    it("should return comment by comment id", async () => {
      const commentById = await commentsService.findById(comment.id, user.id);
      expect(commentById).toBeTruthy()
    });
    it("should not return comment by comment id", async () => {
      const commentById = await commentsService.findById(uuidv4());
      expect(commentById).toBeFalsy()
    });
    it("should update comment", async () => {
      const commentById = await commentsService.update(commentContentType, comment.id);
      expect(commentById).toBeTruthy();
    });
    it("should not update comment", async () => {
      const commentById = await commentsService.update(commentContentType, uuidv4());
      expect(commentById).toBeFalsy();
    });
    it("should like comment", async () => {
      const commentLikes = await commentsService.likeStatus(comment.id, LIKE_STATUS.LIKE, user);
      expect(commentLikes).toBeTruthy()
    });
    it("should like comment without user", async () => {
      const commentLikes = await commentsService.likeStatus(comment.id, LIKE_STATUS.LIKE, undefined);
      expect(commentLikes).toBeTruthy()
    });
    it("should delete comment", async () => {
      const commentById = await commentsService.delete(comment.id);
      expect(commentById).toBeTruthy();
    });
    it("should not delete comment", async () => {
      const commentById = await commentsService.delete(uuidv4());
      expect(commentById).toBeFalsy();
    });
  });



});