import {BloggerDBType, BloggerPaginatorInputType, SearchResultType, BloggerType} from "../db/types";
import {bloggersCollection} from "../db/db";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {v4 as uuidv4} from "uuid";


export const bloggersService = {

  async findAll(paginatorInput: BloggerPaginatorInputType):
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
        id: uuidv4(),
        name,
        youtubeUrl: youtubeUrl ? youtubeUrl : ''
      };
    return await bloggersRepository.create(newBlogger);
  },
  async findById(id: string): Promise<BloggerType | null> {
    return await bloggersRepository.findById(id);
  },
  async update(id: string, name: string, youtubeUrl: string): Promise<boolean> {
    return await bloggersRepository.update(id, name, youtubeUrl);
  },
  async delete(id: string): Promise<boolean> {
    return await bloggersRepository.delete(id);
  }
}