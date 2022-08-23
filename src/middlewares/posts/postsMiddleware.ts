import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {
  postsTitleShorDescriptionContentBloggerIdErrorCreator,
  postsTitleShorDescriptionContentErrorCreator
} from "../../helpers/posts/postsHelpers";
import {postsService} from "../../domain/posts-services";

export const postTitleShorDescriptionContentMiddleware = async (req: Request,
                                                                res: Response,
                                                                next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  errors = postsTitleShorDescriptionContentErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content);

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  } else {
    next();
  }
};

export const postTitleShorDescriptionContentBloggerIdMiddleware = async (req: Request,
                                                                         res: Response,
                                                                         next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  errors = await postsTitleShorDescriptionContentBloggerIdErrorCreator(errors, req.body.title,
    req.body.shortDescription, req.body.content, req.body.bloggerId);

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  } else {
    next();
  }
};

export const postIdMiddleware = async (req: Request,
                                       res: Response,
                                       next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const post = await postsService.findById(req.params.id)
  if (!post) {
    errors = errorsMessagesCreator(
      [],
      "Incorrect post Id",
      "id");
  }

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  } else {
    next();
  }
}

export const postIdDeleteMiddleware = async (req: Request,
                                             res: Response,
                                             next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const post = await postsService.findById(req.params.id)
  if (!post) {
    errors = errorsMessagesCreator(
      [],
      "Post id doesn't exist",
      "id");
  }
  ;

  if (errors?.errorsMessages?.length) {
    return res.status(404).send();
  } else {
    next();
  }
}