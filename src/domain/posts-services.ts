import {BloggerType, PostPaginatorInputType, PostType, SearchResultType} from "../db/types";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {v4 as uuidv4} from "uuid";

export const postsService = {
  async findAll(paginatorInput: PostPaginatorInputType):
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
               bloggerId: string):Promise<PostType> {
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
  async update(id: string, title: string,
         shortDescription: string,
         content: string,
         bloggerId: string): Promise<boolean> {
    const blogger = await bloggersRepository.findById(bloggerId);
    const newPost: PostType = {
      id,
      title,
      shortDescription,
      content, bloggerId,
      bloggerName: blogger ? blogger.name : ""
    };
   return await postsRepository.update(newPost)
  },
  async delete(id: string): Promise<boolean> {
    return await postsRepository.delete(id)
  }
}