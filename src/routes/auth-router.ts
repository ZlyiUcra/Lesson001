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
  emailNotInDBValidationMiddleware,
  loginAndPassAndEmailValidationMiddleware
} from "../middlewares/auth/loginAndPassAndEmailValidationMiddleware";
import {userValidationMiddleware} from "../middlewares/users/userValidationMiddleware";


export const authRouter = Router({});

authRouter.post('/login',
  userValidationMiddleware,
  attemptsRegistrationMiddleware,
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
  loginAndPassAndEmailValidationMiddleware,
  ipMiddleware,
  attemptsRegistrationMiddleware,
  async (req: RequestWithIP, res: Response) => {
    const credentials: CredentialType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    }
    const result = await authService.registration(credentials, req.clientIP);
    if (result) {
      res.status(204).send();
      return;
    }
    res.status(401).send();
  })


authRouter.use('/registration-email-resending',
  ipMiddleware,
  emailNotInDBValidationMiddleware,
  attemptsEmailResendingMiddleware,
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
  codeConfirmationValidation,
  attemptsRegistrationConfirmationMiddleware,
  async (req: RequestWithIP, res: Response) => {
    const {code} = req.body;
    const isConfirmed = await authService.emailConfirmedByCodeAndIP(code, req.clientIP as string);
    if (isConfirmed) {
      res.status(204).send();
      return;
    }
    res.status(400).send();

  });

