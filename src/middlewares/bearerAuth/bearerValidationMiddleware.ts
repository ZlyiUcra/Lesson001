import {NextFunction, Request, Response} from "express";
import {usersService} from "../../domain/users-services";
import {RequestWithUser, UserType} from "../../db/types";
import {jwtUtility} from "../../application/jwt-utility";


export const bearerValidationMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth) {
    const splitAuth = auth.split(" ")
    if (splitAuth[0] === "Bearer" && splitAuth[1]) {
      const jwtBase = splitAuth[1];
      const userId = await jwtUtility.extractUserIdFromToken(jwtBase);
      if (userId) {
        const user = await usersService.findById(userId);
        if (user) {
          req.user = user;
          next();
          return;
        }
      }
    }
  }
  res.status(401).send()

}
