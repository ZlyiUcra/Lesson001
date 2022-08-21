import {NextFunction, Response} from "express";
import {AttemptsType, RequestWithInternetData} from "../../db/types";
import {attemptsService} from "../../domain/attempts-service";
import differenceInSeconds from "date-fns/differenceInSeconds";

export const attemptsRequestMiddleware = async (req: RequestWithInternetData, res: Response,
                                                next: NextFunction) => {
  const forwardedIpsStr = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

  req.clientIP = forwardedIpsStr;

  let attempts: AttemptsType | null = await attemptsService.find(forwardedIpsStr, req.originalUrl, req.method);

  if (attempts) {
    const timeDifference = differenceInSeconds(new Date(), attempts.lastRequestedAt);
    if (timeDifference < 10) {
      if (attempts.limitTimeCount >= 5) {
        return res.status(429).send();
      } else {
        await attemptsService.update(req.clientIP, req.originalUrl.trim(), req.method);
        //return next();
      }
    }// else if(timeDifference > 30) {
    //   await attemptsService.update(req.clientIP, req.originalUrl.trim(), req.method, 1);
    // }
  } else {
    await attemptsService.update(req.clientIP, req.originalUrl.trim(), req.method)
  }
  next();
};