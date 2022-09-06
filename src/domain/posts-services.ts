import {
  BloggerType, LIKE_STATUS,
  PostCreateType,
  PostPaginatorInputType, PostsLikesType,
  PostType,
  PostUpdateType,
  SearchResultType, UserFullType
} from "../db/types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {v4 as uuidv4} from "uuid";
import {postLikesService} from "./postLikes-service";

export const postsService = {
  async getAll(paginatorInput: PostPaginatorInputType):
    Promise<SearchResultType<PostType>> {

    const {pageNumber, pageSize, bloggerId} = paginatorInput;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const postPaginator = {skip, limit, bloggerId}

    const {postsSearch, postsCount} =
      await postsRepository.getAll(postPaginator);

    const result: SearchResultType<PostType> = {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: postsCount,
      items: postsSearch
    }
    return result;
  },
  async create({ title, shortDescription, content, bloggerId }: PostCreateType): Promise<PostType> {
    const id = uuidv4();
    const blogger = await bloggersRepository.findById(bloggerId);

    const newPost: PostType = {
      id,
      title,
      shortDescription,
      content, bloggerId,
      bloggerName: blogger ? blogger.name : `bloggerName_${id}`
    };
    return await postsRepository.create(newPost)
  },
  async findById(id: string): Promise<PostType | null> {
    return await postsRepository.findById(id);
  },
  async update({id, title, shortDescription, content, bloggerId
               }: PostUpdateType): Promise<boolean> {
    const blogger = await bloggersRepository.findById(bloggerId);
    const bloggerName = blogger ? blogger.name : ""
    const post: PostType = { id, title, shortDescription, content, bloggerId, bloggerName };
   return await postsRepository.update(post)
  },
  async delete(id: string): Promise<boolean> {
    return await postsRepository.delete(id)
  },
  async likeStatus(postId: string, likeStatus: LIKE_STATUS, user: UserFullType | undefined): Promise<boolean> {
    if(!user) return false;


    const postLike: PostsLikesType = {
      id: uuidv4(),
      postId,
      likeStatus,
      userId: user.id,
      login: user.credentials.login,
      addedAt:  new Date()
    }

    return  await postLikesService.upsert(postLike);

  }
}