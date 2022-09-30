import "reflect-metadata";
import {CommentContentType, RequestWithFullUser, RequestWithShortUser} from "../db/types";
import {Response} from "express";
import {inject, injectable} from "inversify";
import {CommentsService} from "../domain/comments-services";
import {TYPES} from "../db/iocTypes";

@injectable()
export class CommentsController {
  constructor(
    @inject<CommentsService>(TYPES.CommentsService) private commentsService: CommentsService,
  ){}
  async getComment(req: RequestWithFullUser, res: Response) {
    const user = req.user;
    const result = await this.commentsService.findById(req.params.id, user?.id);
    if (result) return res.status(200).send(result);
    return res.status(404).send()
  }

  async updateComment(req: RequestWithShortUser, res: Response) {
    const comment: CommentContentType = {content: req.body.content}
    const result = await this.commentsService.update(comment, req.params.commentId);
    if (result) return res.status(204).send();
    return res.status(404).send()
  }

  async deleteComment(req: RequestWithShortUser, res: Response) {

    const result = await this.commentsService.delete(req.params.commentId);
    if (result) return res.status(204).send();
    return res.status(404).send()
  }

  async setCommentsLikeStatus(req: RequestWithFullUser, res: Response) {
    const commentId = req.params.commentId;
    const likeStatus = req.body.likeStatus;
    const user = req.user;

    const isLikedStatus = await this.commentsService.likeStatus(commentId, likeStatus, user);

    res.status(204).send();
  }
}