import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";
import {PostsRepository} from "../../repositories/posts-repository";
import {bloggerModel, postLikeModel, postModel, userModel} from "../../db/mongoose/models";
import {BloggersRepository} from "../../repositories/bloggers-repository";
import {PostLikesRepository} from "../../repositories/postLikes-repository";
import {PostLikesService} from "../postLikes-service";
import {PostsServices} from "../posts-services";
import {
  BloggerType,
  CredentialType,
  LIKE_STATUS,
  PostCreateType,
  PostPaginatorInputType,
  PostType,
  PostUpdateType,
  UserFullType
} from "../../db/types";
import {BloggersService} from "../bloggers-services";
import {UsersRepository} from "../../repositories/users-repository";
import {AuthHelperService} from "../auth-helper-service";
import {UsersService} from "../users-service";

describe("integration test for post service", () => {

  const postsRepository: PostsRepository = new PostsRepository(postModel);
  const bloggersRepository = new BloggersRepository(bloggerModel);

  const postLikesRepository = new PostLikesRepository(postLikeModel);
  const postLikesService = new PostLikesService(postLikesRepository);

  const postsServices = new PostsServices(postsRepository, bloggersRepository, postLikesService);
  let post: PostType;

  // users section
  const usersRepository = new UsersRepository(userModel);
  const authHelperService = new AuthHelperService();
  const usersService = new UsersService(usersRepository, authHelperService);


  const email = "test@test.com";
  const login = "login";
  const password = "12345"
  const confirmationToken = "confirmation";
  const userCredentials = new CredentialType(login, email, password);
  let user: UserFullType;

  const bloggerName = "Blogger name";
  const youtubeUrl = "www.youtube.com/link"
  let blogger: BloggerType;
  const bloggersService = new BloggersService(bloggersRepository);
  const userId = uuidv4();
  const bloggerId = uuidv4();

  const bloggerPaginatorInput: PostPaginatorInputType = {
    pageNumber: 1, pageSize: 10, bloggerId
  }

  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    blogger = await bloggersService.create(bloggerName, youtubeUrl);
    user = await usersService.create(userCredentials);
  });
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  describe("posts service", () => {
    it("should return created post", async () => {
      const postCreatedType: PostCreateType = {
        title: "posts title",
        shortDescription: "post description",
        content: "post content",
        bloggerId: blogger.id
      };
      post = await postsServices.create(postCreatedType, user.id);
      expect(post).toBeTruthy()

    });
    it("should return created post without userId", async () => {
      const postCreatedType: PostCreateType = {
        title: "posts title",
        shortDescription: "post description",
        content: "post content",
        bloggerId: blogger.id
      };
      post = await postsServices.create(postCreatedType);

      expect(post).toBeTruthy()

    });
    it("should return created post without blogger", async () => {
      const postCreatedType: PostCreateType = {
        title: "posts title",
        shortDescription: "post description",
        content: "post content",
        bloggerId: ""
      };
      post = await postsServices.create(postCreatedType);

      expect(post).toBeTruthy()

    });
    it("should return all posts", async () => {
      const bloggerPaginatorInput: PostPaginatorInputType = {
        pageNumber: 1, pageSize: 10, bloggerId: blogger.id
      }
      const posts = await postsServices.getAll(bloggerPaginatorInput, user.id);
      expect(posts.items.length).toBeTruthy()
    });
    it("should return all posts without userId", async () => {
      const bloggerPaginatorInput: PostPaginatorInputType = {
        pageNumber: 1, pageSize: 10, bloggerId: blogger.id
      }
      const posts = await postsServices.getAll(bloggerPaginatorInput);
      expect(posts).toBeTruthy()
    });
    it("should return post", async () => {
      const postById = await postsServices.findById(post.id, userId);
      expect(postById).toBeTruthy()
    })
    it("should not return post", async () => {
      const postById = await postsServices.findById(uuidv4());
      expect(postById).toBeFalsy()
    });
    it("should update post", async () => {
      const postUpdate: PostUpdateType = {
        id: post.id,
        title: "posts title",
        shortDescription: "post description",
        content: "post content",
        bloggerId: blogger.id
      }
      const postUpdated = await postsServices.update(postUpdate);
      expect(postUpdated).toBeTruthy()
    });
    it("should not update post", async () => {
      const postUpdate: PostUpdateType = {
        id: "",
        title: "posts title",
        shortDescription: "post description",
        content: "post content",
        bloggerId: blogger.id
      }
      const postUpdated = await postsServices.update(postUpdate);
      expect(postUpdated).toBeFalsy()
    });
    it("should update post without bloggerId", async () => {
      const postUpdate: PostUpdateType = {
        id: post.id,
        title: "posts title",
        shortDescription: "post description",
        content: "post content",
        bloggerId: ""
      }
      const postUpdated = await postsServices.update(postUpdate);
      expect(postUpdated).toBeTruthy()
    });

    it("should like post", async () => {
      const postLikes = await postsServices.likeStatus(post.id, LIKE_STATUS.LIKE, user);
      expect(postLikes).toBeTruthy();
    });
    it("should like post without user", async () => {
      const postLikes = await postsServices.likeStatus(post.id, LIKE_STATUS.LIKE, undefined);
      expect(postLikes).toBeTruthy();
    });
    it("should delete post", async () => {
      const postDeleted = await postsServices.delete(post.id);
      expect(postDeleted).toBe(true);
    });
    it("should not delete post", async () => {
      const postDeleted = await postsServices.delete("");
      expect(postDeleted).toBe(false);
    });
  })


});