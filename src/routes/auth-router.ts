import {Request, Response, Router} from "express";
import {CredentialType, LoginType, RequestWithIP} from "../db/types";
import {authService} from "../domain/auth-services";

import {ipMiddleware} from "../middlewares/ipMiddlware/ipHandler";
import {
  attemptsEmailResendingMiddleware,
  attemptsRegistrationConfirmationMiddleware,
  attemptsRegistrationMiddleware
} from "../middlewares/auth/attemptsMiddleware";
import {
  codeConfirmationValidation,
  emailValidationMiddleware,
  loginAndPassAndEmailValidationMiddleware
} from "../middlewares/auth/loginAndPassAndEmailValidationMiddleware";
import {userValidationMiddleware} from "../middlewares/users/userValidationMiddleware";


export const authRouter = Router({});

authRouter.post('/login',
  attemptsRegistrationMiddleware,
  userValidationMiddleware,
  async (req: Request, res: Response) => {
    const credentials: LoginType = {
      login: req.body.login,
      password: req.body.password
    }

    /*TODO */
    const token = await authService.login(credentials, req.ip);

    if (token !== null) {
      res.status(200).send(token);
      return
    }
    res.status(401).send();
  });

authRouter.post('/registration',
  ipMiddleware,
  attemptsRegistrationMiddleware,
  loginAndPassAndEmailValidationMiddleware,
  async (req: RequestWithIP, res: Response) => {
    const credentials: CredentialType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    }
    console.log("1 - credentials:", credentials)
    const result = await authService.registration(credentials, req.clientIP);
    if (result) {
      res.status(204).send("Input data is accepted. Email with confirmation code will be send to passed email address");
      return
    }
    res.status(401).send();
  })


authRouter.post('/registration-email-resending',
  ipMiddleware,
  attemptsEmailResendingMiddleware,
  emailValidationMiddleware,
  async (req: RequestWithIP, res: Response) => {
    const {email} = req.body;

    const isEmailResent = await authService.emailResending(email, req.clientIP as string);
    if (isEmailResent) {
      res.status(204).send();
      return;
    }
    res.status(400).send();
  })

authRouter.post('/registration-confirmation',
  ipMiddleware,
  attemptsRegistrationConfirmationMiddleware,
  codeConfirmationValidation,
  async (req: RequestWithIP, res: Response) => {
    const {code} = req.body;
    const isConfirmed = await authService.emailConfirmedByCodeAndIP(code, req.clientIP as string);
    if (isConfirmed) {
      res.status(204).send();
      return;
    }
    res.status(400).send();

  });

