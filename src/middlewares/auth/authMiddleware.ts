import {ErrorMessagesType, errorsMessagesCreator} from "../../helpers/errorCommon/errorMessagesCreator";
import {baseErrorList} from "../../helpers/errorCommon/baseErrorListHelper";
import {isValidEmail} from "../../helpers/user/userHelper";
import {NextFunction, Request, Response} from "express";
import {authLoginEmailErrorCreator, is429Status} from "../../helpers/auth/authHeplers";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {AttemptsType, RequestWithInternetData, UserFullType} from "../../db/types";
import {attemptsService} from "../../domain/attempts-service";
import {usersService} from "../../domain/users-services";

export const authLoginPassValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const {login, password} = req.body;

  errors = authLoginEmailErrorCreator(errors, login, password);


  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};
export const authLoginMiddleware = async (req: RequestWithInternetData, res: Response,
                                          next: NextFunction) => {
  const clientIP = req.clientIP || "";
  const {login, password} = req.body;

  const attempts: AttemptsType | null = await attemptsService.find(clientIP, req.originalUrl, req.method);
  const user: UserFullType | null = await usersService.findByLoginPass({login, password});

  if (attempts) {
    if (is429Status(attempts)) {
      return res.status(429).send();
    }
  }
  if (user) {
    await attemptsService.update(clientIP, req.originalUrl, req.method);
  }
  next()
}

export const authUserExistMiddleware = async (req: RequestWithInternetData, res: Response,
                                              next: NextFunction) => {
  const {login, password} = req.body;
  const user: UserFullType | null = await usersService.findByLoginPass({login, password});
  if (!user) {
    return res.status(401).send();
  }
  next()
}