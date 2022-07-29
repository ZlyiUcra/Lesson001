import {BloggerDBType, BloggerPaginatorInput, SearchResultType, BloggerType} from "../db/types";
import {bloggersCollection} from "../db/db";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const bloggersService = {

  async findAll(paginatorInput: BloggerPaginatorInput):
    Promise<SearchResultType<BloggerType>> {

    if (!paginatorInput.pageNumber) paginatorInput.pageNumber = 1;
    if (!paginatorInput.pageSize) paginatorInput.pageSize = 10;

    const {bloggersSearchResult, bloggersCount} =
      await bloggersRepository.findAll(paginatorInput);

    const result: SearchResultType<BloggerType> = {
      pagesCount: Math.ceil(bloggersCount / paginatorInput.pageSize),
      page: paginatorInput.pageNumber,
      pageSize: paginatorInput.pageSize,
      totalCount: bloggersCount,
      items: bloggersSearchResult
    }

    return result;

  },

  async create(name: string, youtubeUrl?: string): Promise<BloggerType> {
    const newBlogger: BloggerType =
      {
        id: +(new Date()),
        name,
        youtubeUrl: youtubeUrl ? youtubeUrl : ''
      };
    return await bloggersRepository.create(newBlogger);
  },
  async findById(id: number): Promise<BloggerType | null> {
    return await bloggersRepository.findById(id);
  },
  async update(id: number, name: string, youtubeUrl: string): Promise<boolean> {
    return await bloggersRepository.update(id, name, youtubeUrl);
  },
  async delete(id: number): Promise<boolean> {
    return await bloggersRepository.delete(id);
  }
}