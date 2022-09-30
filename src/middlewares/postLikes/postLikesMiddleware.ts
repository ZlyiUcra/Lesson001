import {LIKE_STATUS, RequestWithFullUser} from "../../db/types";
import {Response, NextFunction} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";
import { PostsServices} from "../../domain/posts-services";
//import {likesAuthValidator} from "../../helpers/likes/likesHelper";
import {rootContainer} from "../../ioc/compositionRoot";
import {TYPES} from "../../db/iocTypes";
import {LikesAuthValidator} from "../../helpers/likes/LikesAuthValidator";

const likesAuthValidator = rootContainer.get<LikesAuthValidator>(TYPES.LikesAuthValidator);

const postsService = rootContainer.get<PostsServices>(TYPES.PostsServices);

export const postLikesAuthMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {

  const {headerAuth, accessToken, userJWT, user, isBearer} = await likesAuthValidator.likesAuthValidator(req.headers.authorization);
  //const {headerAuth, accessToken, userJWT, user, isBearer} = await likesAuthValidator(req.headers.authorization);

  if (!isBearer) return res.status(401).send()

  next();
}

export const postLikesCorrectLikesStatusMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const likeStatus = req.body.likeStatus;

  const isLikeStatus = Object.values(LIKE_STATUS).includes(likeStatus as LIKE_STATUS)
  if (!isLikeStatus) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect  Post likeStatus",
      "likeStatus"
    );
  }

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  } else {
    next();
  }
}

export const postLikesCorrectsPostIdMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
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