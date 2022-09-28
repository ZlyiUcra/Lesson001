import "reflect-metadata";
import {
  BloggerPaginatorInputType,
  SearchResultType,
  BloggerType,
  BloggerPaginatorType
} from "../db/types";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {v4 as uuidv4} from "uuid";
import {inject, injectable} from "inversify";
import {TYPES} from "../db/iocTypes";

@injectable()
export class BloggersService {
  constructor(
    @inject<BloggersRepository>(TYPES.BloggersRepository) private bloggersRepository: BloggersRepository
  ) {
  }

  async findAll(paginatorInput: BloggerPaginatorInputType):
    Promise<SearchResultType<BloggerType>> {

    let {pageNumber, pageSize, searchNameTerm} = paginatorInput;

    const skip = pageSize * (pageNumber - 1);
    const limit = pageSize;

    const bloggerPaginator = new BloggerPaginatorType(searchNameTerm, skip, limit);


    const {bloggersSearch, bloggersCount} =
      await this.bloggersRepository.getAll(bloggerPaginator);

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
    return await this.bloggersRepository.create(newBlogger);
  }

  async findById(id: string): Promise<BloggerType | null> {
    return await this.bloggersRepository.findById(id);
  }

  async update({id, name, youtubeUrl}: BloggerType): Promise<boolean> {
    return await this.bloggersRepository.update({id, name, youtubeUrl});
  }

  async delete(id: string): Promise<boolean> {
    return await this.bloggersRepository.delete(id);
  }
}
