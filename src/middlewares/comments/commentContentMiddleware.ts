import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {postsErrorCreator} from "../../helpers/posts/postsHelpers";
import {RequestWithUser} from "../../db/types";
import {commentCorrectPostIdValidator, commentErrorCreator} from "../../helpers/comments/commentsHelper";
import {commentsService} from "../../domain/comments-services";

export const commentContentMiddleware = async (req: RequestWithUser,
                                               res: Response,
                                               next: NextFunction) => {

  let errors: ErrorMessagesType | undefined = undefined;

  errors = await commentErrorCreator(errors, req.body.content);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
};

