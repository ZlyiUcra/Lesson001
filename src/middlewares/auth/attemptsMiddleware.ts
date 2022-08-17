import {NextFunction, Request, Response} from "express";
import {authService} from "../../domain/auth-services";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {RequestWithIP, TokenType} from "../../db/types";

export const attemptsRegistrationMiddleware = async (req: RequestWithIP, res: Response, next: NextFunction) => {
  let auth: TokenType | null = null;

  if (req.body.login) {
    auth = await authService.findByLoginAndIP(req.body.login, req.clientIP as string)
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
export const attemptsRegistrationConfirmationMiddleware = async (req: RequestWithIP, res: Response, next: NextFunction) => {
  let auth: TokenType | null = null;

  if (req.body.code) {
    auth = await authService.findByCodeAndIP(req.body.code, req.clientIP as string)
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
export const attemptsEmailResendingMiddleware = async (req: RequestWithIP, res: Response, next: NextFunction) => {
  let auth: TokenType | null = null;

  if (req.body.email) {
    auth = await authService.findByEmailAndIP(req.body.email, req.clientIP as string)
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

const authAttempts = async (auth: TokenType, res: Response,) => {
  const timeDifference = differenceInSeconds(new Date(), auth.lastRequestedAt);
  if (timeDifference < 10) {
    if (auth.limitTimeCount >= 5) {
      return res.status(429).send();
    } else {
      await authService.updateAttemptsInfo(auth)
    }
  }
}