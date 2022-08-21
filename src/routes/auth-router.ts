import {Request, Response, Router} from "express";
import {CredentialType, LoginType, RequestWithInternetData} from "../db/types";
import {authService} from "../domain/auth-services";

import {addIPMiddleware} from "../middlewares/ipMiddlware/addIPMiddleware";

import {
  //codeConfirmationValidation,
  emailValidationMiddleware,
  loginAndPassAndEmailValidationMiddleware
} from "../middlewares/auth/loginAndPassAndEmailValidationMiddleware";
import {authLoginMiddleware, authUserExistMiddleware, authLoginPassValidationMiddleware} from "../middlewares/auth/authMiddleware";
//import {userValidationMiddleware} from "../middlewares/users/usersMiddleware";


export const authRouter = Router({});

authRouter.post('/login',
  addIPMiddleware,
  authLoginMiddleware,
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
  // loginAndPassAndEmailValidationMiddleware,
  async (req: RequestWithInternetData, res: Response) => {
    const credentials: CredentialType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    }
    const result = await authService.registration(credentials);
    if (result) {
      res.status(204).send(result);
      return
    }
    res.status(401).send();
  })
//
//
// authRouter.post('/registration-email-resending',
//   ipMiddleware,
//   attemptsMiddleware,
//   emailValidationMiddleware,
//   async (req: RequestWithIP, res: Response) => {
//     const {email} = req.body;
//
//     const isEmailResent = await authService.emailResending(email, req.clientIP as string);
//     if (isEmailResent) {
//       res.status(204).send();
//       return;
//     }
//     res.status(400).send();
//   })
//
// authRouter.post('/registration-confirmation',
//   ipMiddleware,
//   attemptsMiddleware,
//   codeConfirmationValidation,
//   async (req: RequestWithIP, res: Response) => {
//     const {code} = req.body;
//     const isConfirmed = await authService.emailConfirmedByCodeAndIP(code, req.clientIP as string);
//     if (isConfirmed) {
//       res.status(204).send();
//       return;
//     }
//     res.status(400).send();
//
//   });

