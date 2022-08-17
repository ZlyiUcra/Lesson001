import {NextFunction, Request, Response} from "express";
import {ErrorMessagesType} from "../../helpers/errorCommon/errorMessagesCreator";
import {isErrorsPresent} from "../../helpers/errorCommon/isErrorPresente";
import {confirmationCodeErrorCreator, userAlreadyRegistered} from "../../helpers/auth/authHeplers";
import {usersService} from "../../domain/users-services";
import {
  emailNotExistInDBCreator,
  loginPassEmailErrorCreator,
} from "../../helpers/user/userHelper";
import {authService} from "../../domain/auth-services";
import {RequestWithIP} from "../../db/types";

export const loginAndPassAndEmailValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  const {login, password, email} = req.body;

  const loginLength = login ? login.length : 0;
  const passLength = password ? password.length : 0;

  //login, password and email validation
  errors = loginPassEmailErrorCreator(errors, loginLength, passLength, email);

  // login and email presence in DB validation
  const userByLogin = await usersService.findByLogin(login);
  const userByEmail = await usersService.findByEmail(email);

  if (userByLogin) {
    errors = userAlreadyRegistered(errors, "login");
  }

  if (userByEmail) {
    errors = userAlreadyRegistered(errors, "email");
  }

  if (isErrorsPresent(errors)) {
    return res.status(400).send(errors);
  } else {
    next()
  }

};

export const emailNotInDBValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;
  const {email} = req.body;
  errors = await emailNotExistInDBCreator(errors, email);
  if (errors) {
    res.status(400).send(errors);
    return
  } else {
    next()
  }
}

export const codeConfirmationValidation = async (req: RequestWithIP, res: Response, next: NextFunction) => {
  let errors: ErrorMessagesType | undefined = undefined;

  errors = await confirmationCodeErrorCreator(errors, req.body.code, req.clientIP as string);

  if (errors) {
    return res.status(400).send(errors);
  } else {
    next()
  }

}

