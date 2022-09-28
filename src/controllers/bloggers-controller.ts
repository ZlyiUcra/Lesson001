import "reflect-metadata";
import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {BloggerPaginatorInputType, PostCreateType, PostPaginatorInputType, RequestWithFullUser} from "../db/types";
import {BloggersService} from "../domain/bloggers-services";
import {TYPES} from "../db/iocTypes";
import {PostsServices} from "../domain/posts-services";

@injectable()
export class BloggersController {
  constructor(
    @inject<PostsServices>(TYPES.PostsServices) private postsService: PostsServices,
    @inject<BloggersService>(TYPES.BloggersService) private bloggersService: BloggersService
  ) {

  }

  async getBloggers(req: Request, res: Response) {
    const searchBloggersTerm: BloggerPaginatorInputType = {
      searchNameTerm: req.query.SearchNameTerm ? req.query.SearchNameTerm as string : '',
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }

    const bloggers = await this.bloggersService.findAll(searchBloggersTerm);
    res.send(bloggers);
  }

  async createBlogger(req: Request, res: Response) {
    const newBlogger = await this.bloggersService.create(req.body.name, req.body.youtubeUrl);
    res.status(201).send(newBlogger);
  }

  async getBlogger(req: Request, res: Response) {
    let blogger = await this.bloggersService.findById(req.params.id);

    if (blogger) {
      res.status(200).send(blogger);
      return;
    }
    res.status(404).send();
  }

  async updateBlogger(req: Request, res: Response) {

    const isUpdated = await this.bloggersService.update({
      id: req.params.id,
      name: req.body.name,
      youtubeUrl: req.body.youtubeUrl
    });
    if (isUpdated) {
      res.status(204).send();
      return;
    }
    res.status(404).send();
  }

  async deleteBlogger(req: Request, res: Response) {
    const isDeleted = await this.bloggersService.delete(req.params.id);
    if (isDeleted) {
      res.status(204).send();
      return;
    }
    res.status(404).send();
  }

  async getBloggerPosts(req: RequestWithFullUser, res: Response) {

    const user = req.user;

    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10),
      bloggerId: req.params.bloggerId as string
    };
    const posts = await this.postsService.getAll(searchPostsTerm, user?.id);
    res.send(posts);
  }

  async createBloggerPost(req: Request, res: Response) {

    const postCreate: PostCreateType =
      {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.params.bloggerId
      }

    const post = await this.postsService.create(postCreate);
    if (post) return res.status(201).send(post);
    res.status(404).send();
  }
}