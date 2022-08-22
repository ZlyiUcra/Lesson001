import {Request, Response, Router} from "express";
import {CredentialType, LoginType, RequestWithInternetData} from "../db/types";
import {authService} from "../domain/auth-services";

import {addIPMiddleware} from "../middlewares/ipMiddlware/addIPMiddleware";

import {
  authUserExistMiddleware,
  authLoginPassEmailValidationMiddleware,
  authAttemptsMiddleware,
  authRegistrationEmailValidationMiddleware,
  authCodeConfirmationValidationMiddleware, authConfirmedValidationMiddleware
} from "../middlewares/auth/authMiddleware";


export const authRouter = Router({});

authRouter.post('/login',
  addIPMiddleware,
  authAttemptsMiddleware,
  authUserExistMiddleware,
  async (req: Request, res: Response) => {
    const credentials: LoginType = {
      login: req.body.login,
      password: req.body.password
    }
    const token = await authService.login(credentials, req.ip);
    res.status(200).send(token);
  });

authRouter.post('/registration',
  addIPMiddleware,
  authAttemptsMiddleware,
  authLoginPassEmailValidationMiddleware,
  async (req: RequestWithInternetData, res: Response) => {
    const credentials: CredentialType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    }
    const result = await authService.registration(credentials);
    if (result) {
      return res.status(204).send(result);
    }
    res.status(401).send();
  })


authRouter.post('/registration-email-resending',
  addIPMiddleware,
  authAttemptsMiddleware,
  authRegistrationEmailValidationMiddleware,
  async (req: RequestWithInternetData, res: Response) => {
    const {email} = req.body;

    const isEmailResent = await authService.emailResending(email);
    if (isEmailResent) {
      return res.status(204).send();
    }
    res.status(400).send();
  })

authRouter.post('/registration-confirmation',
  addIPMiddleware,
  authAttemptsMiddleware,
  authCodeConfirmationValidationMiddleware,
  authConfirmedValidationMiddleware,
  async (req: RequestWithInternetData, res: Response) => {
    const {code} = req.body;
    const isConfirmed = await authService.emailConfirmedByCodeAndIP(code);
    if (isConfirmed) {
      res.status(204).send();
      return;
    }
    res.status(400).send();

  });

