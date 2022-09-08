import {
  ExtendedPostLikesInfoType,
  LIKE_STATUS,
  LikeUserDetailsInfoType,
  PostCreateType,
  PostExtendedType, PostInsertType,
  PostLikeType,
  PostPaginatorInputType,
  PostType,
  PostUpdateType,
  SearchResultType,
  UserFullType
} from "../db/types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {v4 as uuidv4} from "uuid";
import {postLikesService} from "./postLikes-service";

import { getPostExtendedElement } from "../helpers/likes/likesHelper";


export const postsService = {
  async create({title, shortDescription, content, bloggerId}: PostCreateType, userId: string = ""): Promise<PostType> {
    const id = uuidv4();
    const blogger = await bloggersRepository.findById(bloggerId);

    const newPost: PostType = {
      id,
      title,
      shortDescription,
      content, bloggerId,
      bloggerName: blogger ? blogger.name : `bloggerName_${id}`,
      addedAt: (new Date()).toString()
    };
    const post =  await postsRepository.create(newPost)
    const postLikes = await postLikesService.findByIds([post.id]);
    const postExtended = getPostExtendedElement(newPost, postLikes, userId);
    return postExtended;
  },
  async getAll(paginatorInput: PostPaginatorInputType, userId: string = ""):
    Promise<SearchResultType<PostExtendedType>> {

    const {pageNumber, pageSize, bloggerId} = paginatorInput;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const postPaginator = {skip, limit, bloggerId}

    const {postsSearch, postsCount} =
      await postsRepository.getAll(postPaginator);

    const postIds: Array<string> = postsSearch.map((p: PostType) => p.id);
    const postLikes: Array<PostLikeType> = await postLikesService.findByIds(postIds);

    const postSearchExtended: Array<PostExtendedType> = postsSearch.map((post: PostType) => getPostExtendedElement(post, postLikes, userId))

    const result: SearchResultType<PostExtendedType> = {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: postsCount,
      items: postSearchExtended
    }
    return result;
  },
  async findById(id: string, userId: string = ""): Promise<PostExtendedType | null> {
    const post = await postsRepository.findById(id);
    if (!post) return null;
    const postLikes = await postLikesService.findByIds([post.id]);
    const postExtended = getPostExtendedElement(post, postLikes, userId);
    return postExtended;
  },
  async update({id, title, shortDescription, content, bloggerId}: PostUpdateType): Promise<boolean> {
    const blogger = await bloggersRepository.findById(bloggerId);
    const bloggerName = blogger ? blogger.name : ""
    const post: PostInsertType = {id, title, shortDescription, content, bloggerId, bloggerName};
    return await postsRepository.update(post)
  },
  async delete(id: string): Promise<boolean> {
    return await postsRepository.delete(id)
  },
  async likeStatus(postId: string, likeStatus: LIKE_STATUS, user: UserFullType | undefined): Promise<boolean> {
    if (!user) return false

    return await postLikesService.upsert(postId, likeStatus, user);

  }
}