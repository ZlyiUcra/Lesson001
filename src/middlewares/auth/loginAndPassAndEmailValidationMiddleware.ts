import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType} from "../../helpers/errorCommon/errorMessagesCreator";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {usersService} from "../../domain/users-services";
import {
  emailValidationCreator,
  authLoginPassEmailErrorCreator,
} from "../../helpers/user/userHelper";
import {authService} from "../../domain/auth-services";
import {RequestWithInternetData} from "../../db/types";

export const loginAndPassAndEmailValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const {login, password, email} = req.body;

  const loginLength = login ? login.length : 0;
  const passLength = password ? password.length : 0;

  errors = authLoginPassEmailErrorCreator(errors, loginLength, passLength, email);


  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};

export const emailValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const {email} = req.body;
  errors = await emailValidationCreator(errors, email);
  if (errors) {
    res.status(400).send(errors);
    return
  } else {
    next()
  }
}

// export const codeConfirmationValidation = async (req: RequestWithIP, res: Response, next: NextFunction) => {
//   let errors: ErrorMessagesType | undefined = undefined;
//
//   errors = await confirmationCodeErrorCreator(errors, req.body.code, req.clientIP as string);
//
//   if (errors) {
//     return res.status(400).send(errors);
//   } else {
//     next()
//   }
//
// }

