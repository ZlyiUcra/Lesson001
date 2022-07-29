import {BloggerType, PostPaginatorInput, PostType, SearchResultType} from "../db/types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";


export const postsService = {
  async findAll(paginatorInput: PostPaginatorInput):
    Promise<SearchResultType<PostType>> {

    if (!paginatorInput.pageNumber) paginatorInput.pageNumber = 1;
    if (!paginatorInput.pageSize) paginatorInput.pageSize = 10;

    const {postsSearchResult, postsCount} =
      await postsRepository.findAll(paginatorInput);

    const result: SearchResultType<PostType> = {
      pagesCount: Math.ceil(postsCount / paginatorInput.pageSize),
      page: paginatorInput.pageNumber,
      pageSize: paginatorInput.pageSize,
      totalCount: postsCount,
      items: postsSearchResult
    }
    return result;
  },
  async create(title: string,
               shortDescription: string,
               content: string,
               bloggerId: number):Promise<PostType> {
    const id = +(new Date());

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
  async findById(id: number): Promise<PostType | null> {
    return await postsRepository.findById(id);
  },
  async update(id: number, title: string,
         shortDescription: string,
         content: string,
         bloggerId: number): Promise<boolean> {
    const blogger = await bloggersRepository.findById(bloggerId);
    const newPost: PostType = {
      id,
      title,
      shortDescription,
      content, bloggerId,
      bloggerName: blogger ? blogger.name : `bloggerName_${id}`
    };
   return await postsRepository.update(newPost)
  },
  async delete(id: number): Promise<boolean> {
    return await postsRepository.delete(id)
  }
}