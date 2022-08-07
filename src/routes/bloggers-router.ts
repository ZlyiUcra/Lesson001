import {Request, Response, Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {bloggersService} from "../domain/bloggers-services";
import {BloggerPaginatorInputType, PostPaginatorInputType} from "../db/types";
import {
  bloggerForPostMiddleware,
  bloggersCorrectIdMiddleware,
  bloggersNameAndYoutubeMiddleware
} from "../middlewares/bloggersMiddleware";
import {postsService} from "../domain/posts-services";
import {postMiddleware} from "../middlewares/posts/postsMiddleware";


export const bloggersRouter = Router({});

bloggersRouter.get("/",
  async (req: Request, res: Response) => {

    const searchBloggersTerm: BloggerPaginatorInputType = {
      searchNameTerm: req.query.SearchNameTerm ? req.query.SearchNameTerm as string : '',
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 0)
    }

    const bloggers = await bloggersService.findAll(searchBloggersTerm);
    res.send(bloggers);
  });

bloggersRouter.post("/",
  authBasicValidationMiddleware,
  bloggersNameAndYoutubeMiddleware,
  async (req: Request, res: Response) => {

    const newBlogger = await bloggersService.create(req.body.name, req.body.youtubeUrl);
    res.status(201).send(newBlogger);
  });

bloggersRouter.get('/:id',
  async (req: Request, res: Response) => {
    let blogger = await bloggersService.findById(req.params.id);

    if (blogger) {
      res.status(200).send(blogger);
      return;
    }
    res.status(404).send();
  });

bloggersRouter.put('/:id',
  authBasicValidationMiddleware,
  bloggersCorrectIdMiddleware,
  async (req: Request, res: Response) => {

    const isUpdated = await bloggersService.update(req.params.id, req.body.name, req.body.youtubeUrl);
    if (isUpdated) {
      res.status(204).send();
      return;
    }
    res.status(404).send();
  });

bloggersRouter.delete('/:id',
  authBasicValidationMiddleware,
  async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.delete(req.params.id);
    if (isDeleted) {
      res.status(204).send();
      return;
    }
    res.status(404).send();
  });

bloggersRouter.get('/:bloggerId/posts',
  bloggerForPostMiddleware,
  async (req: Request, res: Response) => {
    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 0),
      bloggerId: req.params.bloggerId
    };
    const posts = await postsService.findAll(searchPostsTerm);
    res.send(posts);
  });

bloggersRouter.post("/:bloggerId/posts",
  authBasicValidationMiddleware,
  bloggerForPostMiddleware,
  postMiddleware,
  async (req: Request, res: Response) => {

    const newPost = await postsService.create(req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.params.bloggerId);
    res.status(201).send(newPost);
  });