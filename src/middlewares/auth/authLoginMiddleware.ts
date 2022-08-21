import {AttemptsType, RequestWithInternetData, UserFullType} from "../../db/types";
import {NextFunction, Response} from "express";
import {attemptsService} from "../../domain/attempts-service";
import differenceInSeconds from "date-fns/differenceInSeconds";
import {usersService} from "../../domain/users-services";

export const authLoginMiddleware = async (req: RequestWithInternetData, res: Response,
                                          next: NextFunction) => {
  const clientIP = req.clientIP || "";
  const {login, password} = req.body;

  const attempts: AttemptsType | null = await attemptsService.find(clientIP, req.originalUrl, req.method);
  const user: UserFullType | null = await usersService.findByLoginPass({login, password});

  if (attempts) {
    const timeDifference = differenceInSeconds(new Date(), attempts.lastRequestedAt);
    if (timeDifference < 10 && attempts.limitTimeCount >= 5) {
      return res.status(429).send();
    }

    if (!user) {
      return res.status(401).send();
    } else {
      await attemptsService.update(clientIP, req.originalUrl, req.method);
    }
  } else {
    if (user) {
      await attemptsService.update(clientIP, req.originalUrl, req.method);
    }
  }
  next()
}