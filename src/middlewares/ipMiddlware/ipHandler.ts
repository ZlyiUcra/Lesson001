import {NextFunction, Response} from "express";
import {RequestWithIP} from "../../db/types";
import {attemptsService} from "../../domain/attempts-service";

export const ipMiddleware = async (req: RequestWithIP, res: Response,
                                   next: NextFunction) => {
  const forwardedIpsStr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  req.clientIP = forwardedIpsStr as string;
  await attemptsService.update(req.clientIP);
  next();
};