import {NextFunction, Request, Response} from "express";
import {authService} from "../../domain/auth-services";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {TokenType} from "../../db/types";

export const attemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let auth: TokenType | null = null;

  if(req.body.login){
    auth = await authService.findByLoginAndIP(req.body.login, req.ip)
  } else if(req.body.email) {
    auth = await authService.findByEmailAndIP(req.body.email, req.ip)
  } else if(req.body.code){
    auth = await authService.findByCodeAndIP(req.body.code, req.ip)
  }

  if (auth) {
    const timeDifference = differenceInSeconds(new Date(), auth.lastRequestedAt);
    if (timeDifference < 10) {
      if (auth.limitTimeCount >= 5) {
        return res.status(429).send();
      } else {
        await authService.updateAttemptsInfo(auth)
      }
    }
  }
  next();
}