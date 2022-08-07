import {Request, Response, Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {
  CommentContentType,
  PostCommentsInputType,
  PostPaginatorInputType,
  RequestWithUser
} from "../db/types";
import {postsService} from "../domain/posts-services";
import {postCorrectIdMiddleware, postMiddleware} from "../middlewares/postsMiddleware";
import {commentsService} from "../domain/comments-services";
import {bearerValidationMiddleware} from "../middlewares/bearerAuth/bearerValidationMiddleware";
import {commentsMiddleware} from "../middlewares/commentsMiddleware";

export const postsRouter = Router({});

postsRouter.get('/',
  async (req: Request, res: Response) => {
    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 0)
    }
    const posts = await postsService.findAll(searchPostsTerm);
    res.send(posts);
  });

postsRouter.post('/',
  authBasicValidationMiddleware,
  postMiddleware,
  async (req: Request, res: Response) => {

    const newPost = await postsService.create(req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.bloggerId);
    res.status(201).send(newPost);
  });

postsRouter.get("/:postId/comments", async (req: Request, res: Response) => {
  const searchPostComments: PostCommentsInputType = {
    pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
    pageSize: +(req.query.PageSize ? req.query.PageSize : 0),
    postId: req.params.postId
  }
  const comments = await commentsService.findAll(searchPostComments);
  res.send(comments)
});

postsRouter.post("/:postId/comments",
  bearerValidationMiddleware,
  commentsMiddleware,
  async (req: RequestWithUser, res: Response) => {

    const commentContent: CommentContentType = {content: req.body.content};
    const user = req.user;
    if (user) {
      const comment = await commentsService.create(commentContent, user, req.params.postId);
      res.status(201).send(comment);
    }
    res.status(401).send();
  })

postsRouter.get('/:id',
  async (req: Request, res: Response) => {
    const post = await postsService.findById(req.params.id);
    if (post) {
      res.send(post);
      return;
    }
    res.status(404).send();
  });

postsRouter.put('/:id',
  authBasicValidationMiddleware,
  postCorrectIdMiddleware,
  async (req: Request, res: Response) => {
    const isUpdated = await postsService.update(req.params.id, req.body.title,
      req.body.shortDescription, req.body.content, req.body.bloggerId);

    if (isUpdated) {
      res.status(204).send();
      return;
    }
    res.status(404).send();

  });
postsRouter.delete('/:id',
  authBasicValidationMiddleware,
  async (req: Request, res: Response) => {
    const isDeleted = await postsService.delete(req.params.id);
    if (isDeleted) {
      res.status(204).send();
      return;
    }
    res.status(404).send();
  });