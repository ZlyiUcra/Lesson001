import {Request, Response, Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {bloggersService} from "../domain/bloggers-services";
import {BloggerPaginatorInputType, PostCreateType, PostPaginatorInputType, RequestWithFullUser} from "../db/types";
import {
  bloggerForPostMiddleware, bloggersCorrectIdMiddleware,
  bloggersCorrectNameAndYoutubeURLUpdateMiddleware,
  bloggersNameAndYoutubeMiddleware
} from "../middlewares/bloggers/bloggersMiddleware";
import {postsService} from "../domain/posts-services";
import {postTitleShorDescriptionContentMiddleware} from "../middlewares/posts/postsMiddleware";
import {authAddUserDataFromTokenMiddleware} from "../middlewares/auth/authMiddleware";


class BloggersRouter {
  async getBloggers(req: Request, res: Response) {
    const searchBloggersTerm: BloggerPaginatorInputType = {
      searchNameTerm: req.query.SearchNameTerm ? req.query.SearchNameTerm as string : '',
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }

    const bloggers = await bloggersService.findAll(searchBloggersTerm);
    res.send(bloggers);
  }

  async createBlogger(req: Request, res: Response) {
    const newBlogger = await bloggersService.create(req.body.name, req.body.youtubeUrl);
    res.status(201).send(newBlogger);
  }

  async getBlogger(req: Request, res: Response) {
    let blogger = await bloggersService.findById(req.params.id);

    if (blogger) {
      res.status(200).send(blogger);
      return;
    }
    res.status(404).send();
  }

  async updateBlogger(req: Request, res: Response) {

    const isUpdated = await bloggersService.update({
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
    const isDeleted = await bloggersService.delete(req.params.id);
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
    const posts = await postsService.getAll(searchPostsTerm, user?.id);
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

    const post = await postsService.create(postCreate);
    if (post) return res.status(201).send(post);
    res.status(404).send();
  }
}

const bloggersController = new BloggersRouter()

export const bloggersRouter = Router({});

bloggersRouter.get("/",
  bloggersController.getBloggers);

bloggersRouter.post("/",
  authBasicValidationMiddleware,
  bloggersNameAndYoutubeMiddleware,
  bloggersController.createBlogger);

bloggersRouter.get('/:id',
  bloggersController.getBlogger);

bloggersRouter.put('/:id',
  authBasicValidationMiddleware,
  bloggersCorrectNameAndYoutubeURLUpdateMiddleware,
  bloggersCorrectIdMiddleware,
  bloggersController.updateBlogger);

bloggersRouter.delete('/:id',
  authBasicValidationMiddleware,
  bloggersCorrectIdMiddleware,
  bloggersController.deleteBlogger);

bloggersRouter.get('/:bloggerId/posts',
  bloggerForPostMiddleware,
  authAddUserDataFromTokenMiddleware,
  bloggersController.getBloggerPosts);

bloggersRouter.post("/:bloggerId/posts",
  authBasicValidationMiddleware,
  bloggerForPostMiddleware,
  postTitleShorDescriptionContentMiddleware,
  bloggersController.createBloggerPost);