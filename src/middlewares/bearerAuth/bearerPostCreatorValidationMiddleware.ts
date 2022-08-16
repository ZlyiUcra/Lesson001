import {NextFunction, Request, Response} from "express";
import {usersService} from "../../domain/users-services";
import {RequestWithUser, UserType} from "../../db/types";
import {commentsService} from "../../domain/comments-services";
import {jwtUtility} from "../../application/jwt-utility";


export const bearerPostCreatorValidationMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth) {
    const splitAuth = auth.split(" ")
    if (splitAuth[0] === "Bearer" && splitAuth[1]) {
      const jwtBase = splitAuth[1];
      const userId = await jwtUtility.extractUserIdFromToken(jwtBase);

      if (userId) {
        const user = await usersService.findById(userId);
        const comment = await commentsService.findById(req.params.commentId);
        if (!user  || !comment) {
          res.status(404).send();
          return;
        }
        if (user && comment) {
          req.user = user;
          if (user.id === comment.userId) {
            next();
            return
          } else {
            res.status(403).send();
            return;
          }
        }
      }
    }
  }
  res.status(401).send()

}
