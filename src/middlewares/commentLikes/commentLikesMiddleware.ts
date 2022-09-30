import {LIKE_STATUS, RequestWithFullUser} from "../../db/types";
import {Response, NextFunction} from "express";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";
//import {likesAuthValidator} from "../../helpers/likes/likesHelper";
import {rootContainer} from "../../ioc/compositionRoot";
import {CommentsService} from "../../domain/comments-services";
import {TYPES} from "../../db/iocTypes";
import {LikesAuthValidator} from "../../helpers/likes/LikesAuthValidator";

const commentsService = rootContainer.get<CommentsService>(TYPES.CommentsService);
const likesAuthValidator = rootContainer.get<LikesAuthValidator>(TYPES.LikesAuthValidator);

export const commentLikesAuthMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {

  const {headerAuth, accessToken, userJWT, user, isBearer} = await likesAuthValidator.likesAuthValidator(req.headers.authorization)
  //const {headerAuth, accessToken, userJWT, user, isBearer} = await likesAuthValidator(req.headers.authorization)
  if (!isBearer) return res.status(401).send()
  next();
}

export const commentLikesCorrectLikesStatusMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const likeStatus = req.body.likeStatus;

  const isLikeStatus = Object.values(LIKE_STATUS).includes(likeStatus as LIKE_STATUS)
  if (!isLikeStatus) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect Comment likeStatus",
      "likeStatus"
    );
  }

  if (errors?.errorsMessages?.length) {
    return res.status(400).send(errors);
  } else {
    next();
  }
}

export const commentLikesCorrectsCommentIdMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const commentId = req.params.commentId;

  const comment = await commentsService.findById(commentId)
  if (!comment) {
    errors = errorsMessagesCreator(baseErrorList(errors),
      "Incorrect commentId",
      "commentId"
    );
  }

  if (errors?.errorsMessages?.length) {
    return res.status(404).send();
  } else {
    next();
  }
}