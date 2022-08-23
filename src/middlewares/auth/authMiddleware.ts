import {ErrorMessagesType} from "../../helpers/errorCommon/errorMessagesCreator";

import {NextFunction, Request, Response} from "express";
import {
  authCodeConfirmationValidationCreator, authConfirmedValidationCreator,
  authLoginOrEmailAlreadyExistsErrorCreator,
  authLoginPassEmailErrorCreator,
  authRegistrationEmailValidationCreator,
  is429Status
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
  let attemptToSend: AttemptsType = {
    ip: clientIP,
    url: req.originalUrl,
    method: req.method,
    lastRequestedAt: new Date()
  }

  if (attempts) {
    const timeDifference = differenceInSeconds(new Date(), attempts.lastRequestedAt);
    if (is429Status(attempts)) {
      return res.status(429).send();
    } else if (timeDifference > +settings.TIME_LIMIT) {
      await attemptsService.resetCounter(attemptToSend);
    } else await attemptsService.incrementCounter(attemptToSend);
  } else {
    await attemptsService.resetCounter(attemptToSend);
  }
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