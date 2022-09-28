import "reflect-metadata";
import {Router} from "express";
import {authBasicValidationMiddleware} from "../middlewares/basicAuth/authValidationMiddleware";
import {
  postIdDeleteMiddleware,
  postIdMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware
} from "../middlewares/posts/postsMiddleware";
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
import {PostsController} from "../controllers/posts-controller";
import {rootContainer} from "../ioc/compositionRoot";

export const postsRouter = Router({});

const postsController = rootContainer.resolve(PostsController)

postsRouter.get('/',
  authAddUserDataFromTokenMiddleware,
  postsController.getPosts.bind(postsController));

postsRouter.post('/',
  authBasicValidationMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware,
  authAddUserDataFromTokenMiddleware,
  postsController.createPost.bind(postsController));

postsRouter.get("/:postId/comments",
  commentPostIdMiddleware,
  authAddUserDataFromTokenMiddleware,
  postsController.getPostComments.bind(postsController));

postsRouter.post("/:postId/comments",
  bearerValidationMiddleware,
  commentForPostMiddleware,
  commentPostIdMiddleware,
  postsController.createPostComment.bind(postsController))

postsRouter.get('/:id',
  postIdMiddleware,
  authAddUserDataFromTokenMiddleware,
  postsController.getPost.bind(postsController));

postsRouter.put('/:id',
  authBasicValidationMiddleware,
  postIdMiddleware,
  postTitleShorDescriptionContentBloggerIdMiddleware,
  postsController.updatePost.bind(postsController));

postsRouter.delete('/:id',
  authBasicValidationMiddleware,
  postIdDeleteMiddleware,
  postsController.deletePost.bind(postsController));

postsRouter.put('/:postId/like-status',
  authAddUserFromAccessTokenMiddleware,
  postLikesAuthMiddleware,
  postLikesCorrectLikesStatusMiddleware,
  postLikesCorrectsPostIdMiddleware,
  postsController.setPostLikeStatus.bind(postsController));