import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-services";
import {CommentContentType, RequestWithUser} from "../db/types";
import {bearerPostCreatorValidationMiddleware} from "../middlewares/bearerAuth/bearerPostCreatorValidationMiddleware"
import {
  commentContentMiddleware, commentExistsMiddleware,
  commentOwnPostMiddleware,
  commentPostIdMiddleware
} from "../middlewares/comments/commentsMiddleware";


export const commentsRouter = Router({});

commentsRouter.get("/:id",
  commentPostIdMiddleware,
  async (req: Request, res: Response) => {
    const result = await commentsService.findById(req.params.id);
    if (result) res.status(200).send(result);
    res.status(404).send()
  });

commentsRouter.put("/:commentId",
  bearerPostCreatorValidationMiddleware,
  commentOwnPostMiddleware,
  commentContentMiddleware,
  commentExistsMiddleware,
  async (req: RequestWithUser, res: Response) => {
    const comment: CommentContentType = {content: req.body.content}
    const result = await commentsService.update(comment, req.params.commentId);
    if (result) res.status(204).send();
    res.status(404).send()
  });

commentsRouter.delete("/:commentId",
  bearerPostCreatorValidationMiddleware,
  commentOwnPostMiddleware,
  commentExistsMiddleware,
  async (req: RequestWithUser, res: Response) => {

    const result = await commentsService.delete(req.params.commentId);
    if (result) res.status(204).send();
    res.status(404).send()
  });