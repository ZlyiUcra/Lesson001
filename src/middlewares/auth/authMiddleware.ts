import {ErrorMessagesType} from "../../helpers/errorCommon/errorMessagesCreator";

import {NextFunction, Request, Response} from "express";
import {
  authCodeConfirmationValidationCreator, authConfirmedValidationCreator,
  authLoginOrEmailAlreadyExistsErrorCreator,
  authLoginPassEmailErrorCreator,
  authRegistrationEmailValidationCreator,
} from "../../helpers/auth/authHeplers";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {AttemptsType, RequestWithInternetData, TOKEN_STATUS, UserFullType} from "../../db/types";
import {attemptsService} from "../../domain/attempts-service";
import {usersService} from "../../domain/users-services";
import {settings} from "../../settings";
import differenceInSeconds from "date-fns/differenceInSeconds";


export const authUserExistMiddleware = async (req: RequestWithInternetData, res: Response,
                                              next: NextFunction) => {
  const {login, password} = req.body;
  const user: UserFullType | null = await usersService.findByLoginPass({login, password});
  if (!user) {
    return res.status(401).send();
  }
  next()
}
export const authAttemptsMiddleware = async (req: RequestWithInternetData, res: Response,
                                             next: NextFunction) => {
  const clientIP = req.clientIP || "";

  const attempts: AttemptsType | null = await attemptsService.find(clientIP, req.originalUrl, req.method);
  const currentTime = new Date();

  let attemptToSend: AttemptsType = {
    ip: clientIP,
    url: req.originalUrl,
    method: req.method,
    lastRequestsAt: [currentTime]
  }


  if (attempts) {
    const requests = attempts.lastRequestsAt.filter(t => differenceInSeconds(currentTime, t) < +settings.TIME_LIMIT * 1.3);
    const lastRequest = attempts.lastRequestsAt.reduce((a, b) => (a > b ? a : b));

    if (requests.length >= +settings.ATTEMPTS_TOKEN_LIMIT) {
      return res.status(429).send();
    } else {
      if (differenceInSeconds(currentTime, lastRequest) <= +settings.TIME_LIMIT * 2) {
        attemptToSend = {...attemptToSend, lastRequestsAt: [...requests, currentTime]}
      }
    }
  }
  await attemptsService.updateRequests(attemptToSend);
  next()
};

export const authLoginPassEmailValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const {login, password, email} = req.body;

  errors = authLoginPassEmailErrorCreator(errors, login, password, email);

  const existingLoginEmailList = await usersService.findByLoginOrEmail(login, email);
  if (existingLoginEmailList.length) {
    errors = authLoginOrEmailAlreadyExistsErrorCreator(errors, existingLoginEmailList)
  }

  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};

export const authRegistrationEmailValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const {email} = req.body;
  errors = await authRegistrationEmailValidationCreator(errors, email);
  if (errors) {
    return res.status(400).send(errors);
  }
  next()
}

export const authCodeConfirmationValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const user = await usersService.findByCode(req.body.code);
  if (!user) {
    errors = authCodeConfirmationValidationCreator(errors);
  }
  if (errors) {
    return res.status(400).send(errors)
  }
  next()
}
export const authConfirmedValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const user = await usersService.findByCode(req.body.code);

  if (user && user.token.tokenStatus === TOKEN_STATUS.CONFIRMED) {
    errors = authConfirmedValidationCreator(errors);
  }
  if (errors) {
    return res.status(400).send(errors)
  }
  next()
}