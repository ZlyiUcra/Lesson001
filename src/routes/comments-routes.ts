import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-services";
import {CommentContentType, RequestWithFullUser, RequestWithShortUser} from "../db/types";
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


export const commentsRouter = Router({});

commentsRouter.get("/:id",
  authAddUserDataFromTokenMiddleware,
  async (req: RequestWithFullUser, res: Response) => {
    const user = req.user;
    const result = await commentsService.findById(req.params.id, user?.id);
    if (result) return res.status(200).send(result);
    return res.status(404).send()
  });

commentsRouter.put("/:commentId",
  bearerPostCreatorValidationMiddleware,
  commentOwnPostMiddleware,
  commentContentMiddleware,
  async (req: RequestWithShortUser, res: Response) => {
    const comment: CommentContentType = {content: req.body.content}
    const result = await commentsService.update(comment, req.params.commentId);
    if (result) return res.status(204).send();
    return res.status(404).send()
  });

commentsRouter.delete("/:commentId",
  bearerPostCreatorValidationMiddleware,
  commentOwnPostMiddleware,
  commentExistsMiddleware,
  async (req: RequestWithShortUser, res: Response) => {

    const result = await commentsService.delete(req.params.commentId);
    if (result) return res.status(204).send();
    return res.status(404).send()
  });

commentsRouter.put('/:commentId/like-status',
  authAddUserFromAccessTokenMiddleware,
  //commentLikesAuthMiddleware,
  commentLikesCorrectLikesStatusMiddleware,
  commentLikesCorrectsCommentIdMiddleware,
  async (req: RequestWithFullUser, res: Response) => {
    const commentId = req.params.commentId;
    const likeStatus = req.body.likeStatus;
    const user = req.user;

    const isLikedStatus = await commentsService.likeStatus(commentId, likeStatus, user);

    if (!isLikedStatus) return res.status(401).send();
    res.status(204).send();
  }
)