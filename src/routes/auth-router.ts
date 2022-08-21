import {Request, Response, Router} from "express";
import {CredentialType, LoginType, RequestWithInternetData} from "../db/types";
import {authService} from "../domain/auth-services";

import {attemptsRequestMiddleware} from "../middlewares/ipMiddlware/attemptsRequestMiddleware";

import {
  //codeConfirmationValidation,
  emailValidationMiddleware,
  loginAndPassAndEmailValidationMiddleware
} from "../middlewares/auth/loginAndPassAndEmailValidationMiddleware";
import {authLoginPassValidationMiddleware} from "../middlewares/auth/authMiddleware";
//import {userValidationMiddleware} from "../middlewares/users/usersMiddleware";


export const authRouter = Router({});

authRouter.post('/login',
  attemptsRequestMiddleware,
  authLoginPassValidationMiddleware,
  async (req: Request, res: Response) => {
    const credentials: LoginType = {
      login: req.body.login,
      password: req.body.password
    }
    const token = await authService.login(credentials, req.ip);

    if (token !== null) {
      res.status(200).send(token);
      return
    }
    res.status(401).send();
  });
//
// authRouter.post('/registration',
//   ipMiddleware,
//   attemptsMiddleware,
//   loginAndPassAndEmailValidationMiddleware,
//   async (req: RequestWithIP, res: Response) => {
//     const credentials: CredentialType = {
//       login: req.body.login,
//       email: req.body.email,
//       password: req.body.password
//     }
//     const result = await authService.registration(credentials, req.clientIP);
//     if (result) {
//       res.status(204).json("Input data is accepted. Email with confirmation code will be sent to passed email address");
//       return
//     }
//     res.status(401).send();
//   })
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

