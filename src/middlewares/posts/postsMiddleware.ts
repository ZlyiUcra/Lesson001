import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {
  postsTitleShorDescriptionContentBloggerIdErrorCreator,
  postsTitleShorDescriptionContentErrorCreator
} from "../../helpers/posts/postsHelpers";
import {postsService} from "../../domain/posts-services";
import {LIKE_STATUS, RequestWithFullUser} from "../../db/types";
import {jwtUtility} from "../../application/jwt-utility";
import {usersService} from "../../domain/users-services";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";

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

export const postsLikesAuthMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  const headerAuth = req.headers.authorization;
  const accessToken = headerAuth?.split(" ")[1] || "";
  let userJWT = await jwtUtility.extractUserJWTFromToken(accessToken);

  const user = await usersService.findById(userJWT?.id as string);
  if(!user){
    return res.status(401).send()
  }

  next();
}

export const postsLikesCorrectLikesStatusMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const likeStatus = req.body.likeStatus;

  const isLikeStatus = Object.values(LIKE_STATUS).includes(likeStatus as LIKE_STATUS)
  if(!isLikeStatus){
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect likeStatus",
      "likeStatus"
    );
  }

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  } else {
    next();
  }
}

export const postsLikesCorrectsPostIdMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const postId = req.params.postId;

  const post = await postsService.findById(postId)
  if (!post) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect postId",
      "postId"
    );
  }

  if (errors?.errorsMessages?.length) {
    return res.status(404).send();
  } else {
    next();
  }
}