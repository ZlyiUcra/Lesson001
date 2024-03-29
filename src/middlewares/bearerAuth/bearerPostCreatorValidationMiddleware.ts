import {NextFunction, Request, Response} from "express";
import {usersService} from "../../domain/users-services";
import {RequestWithShortUser} from "../../db/types";
import {commentsService} from "../../domain/comments-services";
import {jwtUtility} from "../../application/jwt-utility";


export const bearerPostCreatorValidationMiddleware = async (req: RequestWithShortUser, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send();
  } else {
    const splitAuth = auth.split(" ")
    if (splitAuth[0] === "Bearer" && splitAuth[1]) {
      const jwtBase = splitAuth[1];
      const id = await jwtUtility.extractUserIdFromToken(jwtBase);

      if (id) {
        const user = await usersService.findById(id);
        const comment = await commentsService.findById(req.params.commentId);
        if (!user || !comment) {
          return res.status(404).send();
        }
        if (user && comment) {
          req.user = {id: user.id, login: user.credentials.login};
          if (user.id !== comment.userId) {
            return res.status(403).send();
          }
        }
      }
    }
  }
  next();
}
