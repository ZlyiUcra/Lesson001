import {Request, Response, Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {
  CommentContentType,
  PostCommentsInputType, PostCreateType,
  PostPaginatorInputType, PostUpdateType,
  RequestWithUser
} from "../db/types";
import {postsService} from "../domain/posts-services";
import {
  postIdDeleteMiddleware,
  postIdMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware
} from "../middlewares/posts/postsMiddleware";
import {commentsService} from "../domain/comments-services";
import {bearerValidationMiddleware} from "../middlewares/bearerAuth/bearerValidationMiddleware";
import {
  commentForPostMiddleware,
  commentPostIdMiddleware
} from "../middlewares/comments/commentsMiddleware";

export const postsRouter = Router({});

postsRouter.get('/',
  async (req: Request, res: Response) => {
    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }
    const posts = await postsService.getAll(searchPostsTerm);
    res.send(posts);
  });

postsRouter.post('/',
  authBasicValidationMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware,
  async (req: Request, res: Response) => {
    const postCreate: PostCreateType =
      {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId
      }
    const post = await postsService.create(postCreate);

    return res.status(201).send(post);
  });

postsRouter.get("/:postId/comments",
  commentPostIdMiddleware,
  async (req: Request, res: Response) => {
    const searchPostComments: PostCommentsInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10),
      postId: req.params.postId
    }
    const comments = await commentsService.getAll(searchPostComments);
    res.send(comments)
  });

postsRouter.post("/:postId/comments",
  bearerValidationMiddleware,
  commentForPostMiddleware,
  commentPostIdMiddleware,
  async (req: RequestWithUser, res: Response) => {
    const commentContent: CommentContentType = {content: req.body.content};
    const user = req.user;
    if (user) {
      const comment = await commentsService.create(commentContent, user, req.params.postId);
      return res.status(201).send(comment);
    }
    res.status(401).send();
  })

postsRouter.get('/:id',
  postIdMiddleware,
  async (req: Request, res: Response) => {
    const post = await postsService.findById(req.params.id);
    if (post) {
      return res.status(200).send(post);
    }
    res.status(404).send();
  });

postsRouter.put('/:id',
  authBasicValidationMiddleware,
  postIdMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware,
  async (req: Request, res: Response) => {
    const post: PostUpdateType = {
      id: req.params.id,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      bloggerId: req.body.bloggerId
    }
    const isUpdated = await postsService.update(post);

    if (isUpdated) {
      return res.status(204).send();
    }
    res.status(404).send();
  });

postsRouter.delete('/:id',
  authBasicValidationMiddleware,
  postIdDeleteMiddleware,
  async (req: Request, res: Response) => {
    const isDeleted = await postsService.delete(req.params.id);
    if (isDeleted) {
      return res.status(204).send();
    }
    res.status(404).send();
  });