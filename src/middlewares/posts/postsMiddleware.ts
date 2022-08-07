import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {postsErrorCreator} from "../../helpers/posts/postsHelpers";

export const postMiddleware = async (req: Request,
                                     res: Response,
                                     next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  errors = await postsErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content, req.body.bloggerId);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
};

export const postCorrectIdMiddleware = async (req: Request,
                                              res: Response,
                                              next: NextFunction) => {
  let errors: ErrorMessagesType | undefined;
  if (!req.params.id) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect post's Id",
      "id");
  }
  ;
  errors = await postsErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content, req.body.bloggerId);

  if (errors?.errorsMessages?.length) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
}