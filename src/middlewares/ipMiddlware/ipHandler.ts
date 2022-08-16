import {NextFunction, Response} from "express";
import requestIp from 'request-ip';
import {RequestWithIP} from "../../db/types";

export const ipMiddleware = (req: RequestWithIP, res: Response,
                             next: NextFunction) => {
  req.clientIP = requestIp.getClientIp(req);
  next();
};