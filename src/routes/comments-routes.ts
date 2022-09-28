import "reflect-metadata";
import {Router} from "express";
import {bearerPostCreatorValidationMiddleware} from "../middlewares/bearerAuth/bearerPostCreatorValidationMiddleware"
import {
  commentContentMiddleware, commentExistsMiddleware,
  commentOwnPostMiddleware,
} from "../middlewares/comments/commentsMiddleware";
import {
  authAddUserDataFromTokenMiddleware,
  authAddUserFromAccessTokenMiddleware
} from "../middlewares/auth/authMiddleware";
import {
  commentLikesAuthMiddleware,
  commentLikesCorrectLikesStatusMiddleware, commentLikesCorrectsCommentIdMiddleware
} from "../middlewares/commentLikes/commentLikesMiddleware";
import {CommentsController} from "../controllers/comments-controller";
import {rootContainer} from "../ioc/compositionRoot";

export const commentsRouter = Router({});

const commentsController = rootContainer.resolve(CommentsController)


commentsRouter.get("/:id",
  authAddUserDataFromTokenMiddleware,
  commentsController.getComment.bind(commentsController));

commentsRouter.put("/:commentId",
  bearerPostCreatorValidationMiddleware,
  commentOwnPostMiddleware,
  commentContentMiddleware,
  commentsController.updateComment.bind(commentsController));

commentsRouter.delete("/:commentId",
  bearerPostCreatorValidationMiddleware,
  commentOwnPostMiddleware,
  commentExistsMiddleware,
  commentsController.deleteComment.bind(commentsController));

commentsRouter.put('/:commentId/like-status',
  authAddUserFromAccessTokenMiddleware,
  commentLikesAuthMiddleware,
  commentLikesCorrectLikesStatusMiddleware,
  commentLikesCorrectsCommentIdMiddleware,
  commentsController.setCommentsLikeStatus.bind(commentsController)
)