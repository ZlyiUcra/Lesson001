import {
  BloggerDBType,
  BloggerPaginatorInputType,
  SearchResultType,
  BloggerType,
  BloggerPaginatorType
} from "../db/types";
//import {bloggersCollection} from "../db/db";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {v4 as uuidv4} from "uuid";


export class BloggersService {

  async findAll(paginatorInput: BloggerPaginatorInputType):
    Promise<SearchResultType<BloggerType>> {

    let {pageNumber, pageSize, searchNameTerm} = paginatorInput;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const bloggerPaginator = new BloggerPaginatorType(searchNameTerm, skip, limit);


    const {bloggersSearch, bloggersCount} =
      await bloggersRepository.getAll(bloggerPaginator);

    const result: SearchResultType<BloggerType> = {
      pagesCount: Math.ceil(bloggersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: bloggersCount,
      items: bloggersSearch
    }

    return result;

  }

  async create(name: string, youtubeUrl: string): Promise<BloggerType> {
    const newBlogger: BloggerType =
      {
        id: uuidv4(),
        name,
        youtubeUrl: youtubeUrl
      };
    return await bloggersRepository.create(newBlogger);
  }

  async findById(id: string): Promise<BloggerType | null> {
    return await bloggersRepository.findById(id);
  }

  async update({id, name, youtubeUrl}: BloggerType): Promise<boolean> {
    return await bloggersRepository.update({id, name, youtubeUrl});
  }

  async delete(id: string): Promise<boolean> {
    return await bloggersRepository.delete(id);
  }
}

export const bloggersService = new BloggersService()