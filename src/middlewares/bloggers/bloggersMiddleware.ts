import "reflect-metadata";
import {NextFunction, Request, Response} from "express";
import {BloggersService} from "../../domain/bloggers-services";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {bloggerNameAndYoutubeURLErrorCreator} from "../../helpers/bloggers/bloggersHelpers";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {rootContainer} from "../../ioc/compositionRoot";
import {TYPES} from "../../db/iocTypes";

const bloggersService = rootContainer.get<BloggersService>(TYPES.BloggersService);

export const bloggerForPostMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const blogger = await bloggersService.findById(req.params.bloggerId);
  if (!blogger) {
    return res.status(404).send();
  }
  next()
};

export const bloggersNameAndYoutubeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  errors = bloggerNameAndYoutubeURLErrorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next();
  }
}

export const bloggersCorrectNameAndYoutubeURLUpdateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined;

  errors = bloggerNameAndYoutubeURLErrorCreator(errors, req.body.name, req.body.youtubeUrl);

  if (isErrorsPresent(errors)) {
    res.status(400).send(errors);
    return;
  } else {
    next();
  }
}

export const bloggersCorrectIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined;

  const blogger = await bloggersService.findById(req.params.id)
  if (!blogger) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect blogger's Id",
      "id");
  }

  if (isErrorsPresent(errors)) {
    res.status(404).send();
    return;
  } else {
    next();
  }
}
