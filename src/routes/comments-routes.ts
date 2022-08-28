import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-services";
import {CommentContentType, RequestWithShortUser} from "../db/types";
import {bearerPostCreatorValidationMiddleware} from "../middlewares/bearerAuth/bearerPostCreatorValidationMiddleware"
import {
  commentContentMiddleware, commentExistsMiddleware,
  commentOwnPostMiddleware,
} from "../middlewares/comments/commentsMiddleware";


export const commentsRouter = Router({});

commentsRouter.get("/:id",
  async (req: Request, res: Response) => {
    const result = await commentsService.findById(req.params.id);
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