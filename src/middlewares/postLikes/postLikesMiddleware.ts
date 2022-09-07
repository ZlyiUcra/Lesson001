import {LIKE_STATUS, RequestWithFullUser} from "../../db/types";
import {Response, NextFunction} from "express";
import {jwtUtility} from "../../application/jwt-utility";
import {usersService} from "../../domain/users-services";
import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";
import {postsService} from "../../domain/posts-services";


export const postLikesAuthMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
  const headerAuth = req.headers.authorization;
  const accessToken = headerAuth?.split(" ")[1] || "";
  let userJWT = await jwtUtility.extractUserJWTFromToken(accessToken);

  const user = await usersService.findById(userJWT?.id as string);

  if(!user){
    return res.status(401).send()
  }

  next();
}

export const postLikesCorrectLikesStatusMiddleware = async (req: RequestWithFullUser, res: Response, next: NextFunction) => {
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