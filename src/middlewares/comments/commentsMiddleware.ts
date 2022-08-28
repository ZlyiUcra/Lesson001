import {RequestWithShortUser} from "../../db/types";
import {NextFunction, Response} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {commentContentErrorCreator} from "../../helpers/comments/commentsHelper";
import {postsService} from "../../domain/posts-services";
import {commentsService} from "../../domain/comments-services";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";

export const commentForPostMiddleware = async (req: RequestWithShortUser,
                                               res: Response,
                                               next: NextFunction) => {

  let errors: ErrorMessagesType | undefined = undefined;

  errors = await commentContentErrorCreator(errors, req.body.content);

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  }
  next();
};

export const commentPostIdMiddleware = async (req: RequestWithShortUser, res: Response, next: NextFunction) => {
  const post = await postsService.findById(req.params.postId);
  if (!post) {
    return res.status(404).send();
  }
  next();
}

export const commentOwnPostMiddleware = async (req: RequestWithShortUser,
                                               res: Response,
                                               next: NextFunction) => {

  const comment = await commentsService.findById(req.params.commentId)
  if (comment) {
    const userId = req.user?.id as string;
    if (comment.userId !== userId) {
      return res.status(403).send();
    }
  }
  next();
};

export const commentContentMiddleware = async (req: RequestWithShortUser,
                                               res: Response,
                                               next: NextFunction) => {

  let errors: ErrorMessagesType | undefined = undefined;

  errors = await commentContentErrorCreator(errors, req.body.content);

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  }
  next();
};

export const commentExistsMiddleware = async (req: RequestWithShortUser,
                                              res: Response,
                                              next: NextFunction) => {

  let errors: ErrorMessagesType | undefined = undefined;

  const comment = await commentsService.findById(req.params.commentId);
  if (!comment) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Comment does not exist",
      "commentId"
    );
  }

  if (errors?.errorsMessages?.length) {
    return res.status(404).send(errors);
  } else {
    next();
  }
};