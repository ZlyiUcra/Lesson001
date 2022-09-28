import "reflect-metadata";
import {
  LIKE_STATUS,
  PostCreateType,
  PostExtendedType, PostInsertType,
  PostLikeType,
  PostPaginatorInputType,
  PostType,
  PostUpdateType,
  SearchResultType,
  UserFullType
} from "../db/types";
import {v4 as uuidv4} from "uuid";

import {getPostExtendedElement} from "../helpers/likes/likesHelper";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";
import {PostsRepository} from "../repositories/posts-repository";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {PostLikesService} from "./postLikes-service";

@injectable()
export class PostsServices {
  constructor(
    @inject<PostsRepository>(TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject<BloggersRepository>(TYPES.BloggersRepository) private bloggersRepository: BloggersRepository,
    @inject<PostLikesService>(TYPES.PostLikesService) private postLikesService: PostLikesService
  ){}
  async create({title, shortDescription, content, bloggerId}: PostCreateType, userId: string = ""): Promise<PostType> {
    const id = uuidv4();
    const blogger = await this.bloggersRepository.findById(bloggerId);

    const newPost: PostType = {
      id,
      title,
      shortDescription,
      content, bloggerId,
      bloggerName: blogger ? blogger.name : `bloggerName_${id}`,
      addedAt: (new Date()).toString()
    };
    const post = await this.postsRepository.create(newPost)
    const postLikes = await this.postLikesService.findByIds([post.id]);
    const postExtended = getPostExtendedElement(newPost, postLikes, userId);
    return postExtended;
  }

  async getAll(paginatorInput: PostPaginatorInputType, userId: string = ""):
    Promise<SearchResultType<PostExtendedType>> {

    const {pageNumber, pageSize, bloggerId} = paginatorInput;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const postPaginator = {skip, limit, bloggerId}

    const {postsSearch, postsCount} =
      await this.postsRepository.getAll(postPaginator);

    const postIds: Array<string> = postsSearch.map((p: PostType) => p.id);
    const postLikes: Array<PostLikeType> = await this.postLikesService.findByIds(postIds);

    const postSearchExtended: Array<PostExtendedType> = postsSearch.map((post: PostType) => getPostExtendedElement(post, postLikes, userId))

    const result: SearchResultType<PostExtendedType> = {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: postsCount,
      items: postSearchExtended
    }
    return result;
  }

  async findById(id: string, userId: string = ""): Promise<PostExtendedType | null> {
    const post = await this.postsRepository.findById(id);
    if (!post) return null;
    const postLikes = await this.postLikesService.findByIds([post.id]);
    const postExtended = getPostExtendedElement(post, postLikes, userId);
    return postExtended;
  }

  async update({id, title, shortDescription, content, bloggerId}: PostUpdateType): Promise<boolean> {
    const blogger = await this.bloggersRepository.findById(bloggerId);
    const bloggerName = blogger ? blogger.name : ""
    const post: PostInsertType = {id, title, shortDescription, content, bloggerId, bloggerName};
    return await this.postsRepository.update(post)
  }

  async delete(id: string): Promise<boolean> {
    return await this.postsRepository.delete(id)
  }

  async likeStatus(postId: string, likeStatus: LIKE_STATUS, user: UserFullType | undefined): Promise<boolean> {

    return await this.postLikesService.upsert(postId, likeStatus, user || null);

  }
}

//export const postsService = new PostsServices()