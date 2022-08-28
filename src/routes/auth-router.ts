import {Request, Response, Router} from "express";
import {CredentialType, LoginType, RequestWithFullUser, RequestWithInternetData, UserFullType} from "../db/types";
import {authService} from "../domain/auth-services";

import {addIPMiddleware} from "../middlewares/ipMiddlware/addIPMiddleware";

import {
  authUserExistMiddleware,
  authLoginPassEmailValidationMiddleware,
  authAttemptsMiddleware,
  authRegistrationEmailValidationMiddleware,
  authCodeConfirmationValidationMiddleware,
  authConfirmedValidationMiddleware,
  authAddUserDataFromTokenMiddleware,
  authRefreshTokenBlacklistMiddleware,
  authRefreshTokenIsValidMiddleware,
  authLogoutMiddleware, authAccessTokenAliveMiddleware, authAddUserFromAccessTokenMiddleware
} from "../middlewares/auth/authMiddleware";
import {jwtUtility} from "../application/jwt-utility";


export const authRouter = Router({});

authRouter.post('/refresh-token',
  // addIPMiddleware,
  authRefreshTokenBlacklistMiddleware,
  authRefreshTokenIsValidMiddleware,
  authAddUserDataFromTokenMiddleware,
  // authAccessTokenAliveMiddleware,
  async (req: RequestWithFullUser, res: Response) => {
    const user = req.user;

    if (!user) {
      return res.status(401).send();
    } else {
      const accessToken = await jwtUtility.createJWT({
        id: user.id,
        login: user.credentials.login
      }, "10s");
      const refreshToken = await jwtUtility.createUserJWT({
        id: user.id,
        login: user.credentials.login,
        email: user.credentials.email
      }, "20s");
      //res.cookie("refreshToken", refreshToken);
      res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true});

      return res.status(200).send({accessToken});
    }
  });

authRouter.post('/login',
  addIPMiddleware,
  authAttemptsMiddleware,
  authUserExistMiddleware,
  async (req: Request, res: Response) => {
    const credentials: LoginType = {
      login: req.body.login,
      password: req.body.password
    }

    const result = await authService.login(credentials);
    if (result) {
      const {accessToken, user} = result;

      const refreshToken = await jwtUtility.createUserJWT({
        id: user.id,
        login: user.credentials.login,
        email: user.credentials.email
      }, "20s");
      res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true})
      //res.cookie("refreshToken", refreshToken);
      return res.status(200).send({accessToken});
    }
    return res.status(401).send()
  });

authRouter.post('/logout',
  authLogoutMiddleware,
  async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.status(204).send();
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
      return res.status(204).send();
    }
    return res.status(401).send();
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
    return res.status(400).send();
  })

authRouter.post('/registration-confirmation',
  addIPMiddleware,
  authAttemptsMiddleware,
  authCodeConfirmationValidationMiddleware,
  authConfirmedValidationMiddleware,
  async (req: RequestWithInternetData, res: Response) => {
    const {code} = req.body;
    const isConfirmed = await authService.emailConfirmedByCode(code);
    if (isConfirmed) {
      return res.status(204).send();
    }
    return res.status(400).send();

  });

authRouter.get('/me',
  authAddUserFromAccessTokenMiddleware,
  authAccessTokenAliveMiddleware,
  async (req: RequestWithFullUser, res: Response) => {
    const user = req.user;

    if (!user)
      return res.status(401).send();

    const result = {
      userId: user.id,
      login: user.credentials.login,
      email: user.credentials.email
    }

    res.status(200).send(result);

  });
