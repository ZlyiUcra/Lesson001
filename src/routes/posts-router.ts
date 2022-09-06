import {Request, Response, Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {
  CommentContentType,
  PostCommentsInputType, PostCreateType,
  PostPaginatorInputType, PostUpdateType, RequestWithFullUser,
  RequestWithShortUser
} from "../db/types";
import {postsService} from "../domain/posts-services";
import {
  postIdDeleteMiddleware,
  postIdMiddleware,
  postsLikesAuthMiddleware,
  postsLikesCorrectLikesStatusMiddleware,
  postsLikesCorrectsPostIdMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware
} from "../middlewares/posts/postsMiddleware";
import {commentsService} from "../domain/comments-services";
import {bearerValidationMiddleware} from "../middlewares/bearerAuth/bearerValidationMiddleware";
import {
  commentForPostMiddleware,
  commentPostIdMiddleware
} from "../middlewares/comments/commentsMiddleware";
import {jwtUtility} from "../application/jwt-utility";
import {authAddUserFromAccessTokenMiddleware} from "../middlewares/auth/authMiddleware";

export const postsRouter = Router({});

postsRouter.get('/',
  async (req: Request, res: Response) => {
    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }
    const posts = await postsService.getAll(searchPostsTerm);
    return res.send(posts);
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
    return res.send(comments)
  });

postsRouter.post("/:postId/comments",
  bearerValidationMiddleware,
  commentForPostMiddleware,
  commentPostIdMiddleware,
  async (req: RequestWithShortUser, res: Response) => {
    const commentContent: CommentContentType = {content: req.body.content};
    const user = req.user;
    if (user) {
      const comment = await commentsService.create(commentContent, user, req.params.postId);
      return res.status(201).send(comment);
    }
    return res.status(401).send();
  })

postsRouter.get('/:id',
  postIdMiddleware,
  async (req: Request, res: Response) => {
    const post = await postsService.findById(req.params.id);
    if (post) {
      return res.status(200).send(post);
    }
    return res.status(404).send();
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
    return res.status(404).send();
  });

postsRouter.delete('/:id',
  authBasicValidationMiddleware,
  postIdDeleteMiddleware,
  async (req: Request, res: Response) => {
    const isDeleted = await postsService.delete(req.params.id);
    if (isDeleted) {
      return res.status(204).send();
    }
    return res.status(404).send();
  });

postsRouter.put('/:postId/like-status',
  authAddUserFromAccessTokenMiddleware,
  postsLikesAuthMiddleware,
  postsLikesCorrectLikesStatusMiddleware,
  postsLikesCorrectsPostIdMiddleware,
  async (req: RequestWithFullUser, res: Response) => {
    const postId = req.params.postId;
    const likeStatus = req.body.likeStatus;
    const user = req.user
    const isLikedStatus = await postsService.likeStatus(postId, likeStatus, user);

    if(!isLikedStatus) return res.status(401).send();
    res.status(204).send()
  });