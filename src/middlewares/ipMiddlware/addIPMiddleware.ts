import {NextFunction, Response} from "express";
import {AttemptsType, RequestWithInternetData} from "../../db/types";
import {attemptsService} from "../../domain/attempts-service";
import differenceInSeconds from "date-fns/differenceInSeconds";

export const addIPMiddleware = async (req: RequestWithInternetData, res: Response,
                                      next: NextFunction) => {
  const forwardedIpsStr = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

  req.clientIP = forwardedIpsStr;

  next();
};