import {NextFunction, Response} from "express";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {AttemptsType, RequestWithIP, } from "../../db/types";
import {attemptsService} from "../../domain/attempts-service";

export const attemptsMiddleware = async (req: RequestWithIP, res: Response, next: NextFunction) => {

  let attempts: AttemptsType | null = await attemptsService.find(req.clientIP as string);

  if (attempts) {
    const timeDifference = differenceInSeconds(new Date(), attempts.lastRequestedAt);
    if (timeDifference < 10) {
      if (attempts.limitTimeCount > 5) {
        return res.status(429).send();
      }
    }
  }
  next();
}

