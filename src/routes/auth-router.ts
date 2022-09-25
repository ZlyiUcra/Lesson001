import {Request, Response, Router} from "express";
import {CredentialType, LoginType, RequestWithFullUser, RequestWithInternetData} from "../db/types";

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
import {rootContainer} from "../ioc/compositionRoot";
import {AuthController} from "../controllers/auth-controller";


const authController = rootContainer.resolve(AuthController)

export const authRouter = Router({});

authRouter.post('/refresh-token',
  // addIPMiddleware,
  authRefreshTokenBlacklistMiddleware,
  authRefreshTokenIsValidMiddleware,
  authAddUserDataFromTokenMiddleware,
  // authAccessTokenAliveMiddleware,
  authController.refreshToken.bind(authController));

authRouter.post('/login',
  addIPMiddleware,
  authAttemptsMiddleware,
  authUserExistMiddleware,
  authController.login.bind(authController));

authRouter.post('/logout',
  authLogoutMiddleware,
  authController.logout.bind(authController));

authRouter.post('/registration',
  addIPMiddleware,
  authAttemptsMiddleware,
  authLoginPassEmailValidationMiddleware,
  authController.registration.bind(authController))


authRouter.post('/registration-email-resending',
  addIPMiddleware,
  authAttemptsMiddleware,
  authRegistrationEmailValidationMiddleware,
  authController.registrationEmailResending.bind(authController))

authRouter.post('/registration-confirmation',
  addIPMiddleware,
  authAttemptsMiddleware,
  authCodeConfirmationValidationMiddleware,
  authConfirmedValidationMiddleware,
  authController.registrationConfirmation.bind(authController));

authRouter.get('/me',
  authAddUserFromAccessTokenMiddleware,
  authAccessTokenAliveMiddleware,
  authController.me.bind(authController));
