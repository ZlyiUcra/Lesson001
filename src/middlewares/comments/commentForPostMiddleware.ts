import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {postsErrorCreator} from "../../helpers/posts/postsHelpers";
import {RequestWithUser} from "../../db/types";
import {commentCorrectPostIdValidator, commentErrorCreator} from "../../helpers/comments/commentsHelper";
import {postsService} from "../../domain/posts-services";

export const commentForPostMiddleware = async (req: RequestWithUser,
                                               res: Response,
                                               next: NextFunction) => {

  const post = await postsService.findById(req.params.postId);
  if (!post) {
    res.status(404).send();
    return;
  }

  let errors: ErrorMessagesType | undefined = undefined;

  errors = await commentErrorCreator(errors, req.body.content);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
};
