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
  postTitleShorDescriptionContentBloggerIdMiddleware
} from "../middlewares/posts/postsMiddleware";
import {commentsService} from "../domain/comments-services";
import {bearerValidationMiddleware} from "../middlewares/bearerAuth/bearerValidationMiddleware";
import {
  commentForPostMiddleware,
  commentPostIdMiddleware
} from "../middlewares/comments/commentsMiddleware";
import {
  authAddUserDataFromTokenMiddleware,
  authAddUserFromAccessTokenMiddleware
} from "../middlewares/auth/authMiddleware";
import {
  postLikesAuthMiddleware,
  postLikesCorrectLikesStatusMiddleware, postLikesCorrectsPostIdMiddleware
} from "../middlewares/postLikes/postLikesMiddleware";

export const postsRouter = Router({});

class PostsController {
  async getPosts(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    const searchPostsTerm: PostPaginatorInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }
    const posts = await postsService.getAll(searchPostsTerm, user?.id);
    return res.send(posts);
  }

  async createPost(req: RequestWithFullUser, res: Response) {
    const postCreate: PostCreateType =
      {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        bloggerId: req.body.bloggerId
      }
    const user = req.user;
    const post = await postsService.create(postCreate, user?.id);

    return res.status(201).send(post);
  }

  async getPostComments(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    const searchPostComments: PostCommentsInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10),
      postId: req.params.postId
    }
    const comments = await commentsService.getAll(searchPostComments, user?.id);
    return res.send(comments)
  }

  async createPostComment(req: RequestWithShortUser, res: Response) {
    const commentContent: CommentContentType = {content: req.body.content};
    const user = req.user;
    if (user) {
      const comment = await commentsService.create(commentContent, user, req.params.postId);
      return res.status(201).send(comment);
    }
    return res.status(401).send();
  }

  async getPost(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    const post = await postsService.findById(req.params.id, user?.id);
    if (post) {
      return res.status(200).send(post);
    }
    return res.status(404).send();
  }

  async updatePost(req: Request, res: Response) {
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
  }

  async deletePost(req: Request, res: Response) {
    const isDeleted = await postsService.delete(req.params.id);
    if (isDeleted) {
      return res.status(204).send();
    }
    return res.status(404).send();
  }

  async setPostLikeStatus(req: RequestWithFullUser, res: Response) {
    const postId = req.params.postId;
    const likeStatus = req.body.likeStatus;
    const user = req.user

    const isLikedStatus = await postsService.likeStatus(postId, likeStatus, user);

    //if(!isLikedStatus) return res.status(401).send();
    res.status(204).send()
  }
}

const postsController = new PostsController();

postsRouter.get('/',
  authAddUserDataFromTokenMiddleware,
  postsController.getPosts);

postsRouter.post('/',
  authBasicValidationMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware,
  authAddUserDataFromTokenMiddleware,
  postsController.createPost);

postsRouter.get("/:postId/comments",
  commentPostIdMiddleware,
  authAddUserDataFromTokenMiddleware,
  postsController.getPostComments);

postsRouter.post("/:postId/comments",
  bearerValidationMiddleware,
  commentForPostMiddleware,
  commentPostIdMiddleware,
  postsController.createPostComment)

postsRouter.get('/:id',
  postIdMiddleware,
  authAddUserDataFromTokenMiddleware,
  postsController.getPost);

postsRouter.put('/:id',
  authBasicValidationMiddleware,
  postIdMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware,
  postsController.updatePost);

postsRouter.delete('/:id',
  authBasicValidationMiddleware,
  postIdDeleteMiddleware,
  postsController.deletePost);

postsRouter.put('/:postId/like-status',
  authAddUserFromAccessTokenMiddleware,
  postLikesAuthMiddleware,
  postLikesCorrectLikesStatusMiddleware,
  postLikesCorrectsPostIdMiddleware,
  postsController.setPostLikeStatus);