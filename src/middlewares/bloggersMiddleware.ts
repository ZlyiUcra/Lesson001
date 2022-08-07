import {NextFunction, Request, Response} from "express";
import {bloggersService} from "../domain/bloggers-services";
import {ErrorMessagesType, errorsMessagesCreator} from "../helpers/errorCommon/errorMessagesCreator";
import {bloggerErrorCreator} from "../helpers/bloggers/bloggersHelpers";
import {isErrorsPresent} from "../helpers/errorCommon/isErrorPresente";

export const bloggerForPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.bloggerId) {
    const blogger = await bloggersService.findById(req.params.bloggerId);
    if (blogger !== null) {
      next();
      return;
    }
  }
  return res.status(404).send();
};

export const bloggersNameAndYoutubeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  errors = bloggerErrorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (isErrorsPresent(errors)) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
}

export const bloggersCorrectIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined;
  if (!req.params.id) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect blogger's Id",
      "id");
  }

  errors = bloggerErrorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (isErrorsPresent(errors)) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
}