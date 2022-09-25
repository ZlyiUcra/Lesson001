import {AuthService} from "../domain/auth-services";
import {CredentialType, LoginType, RequestWithFullUser, RequestWithInternetData} from "../db/types";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {JwtUtility} from "../application/jwt-utility";
import {EmailAdapter} from "../adapters/email-adapter";
import {TYPES} from "../db/iocTypes";


@injectable()
export class AuthController {
  constructor(
    @inject<AuthService>(TYPES.AuthService) private authService: AuthService,
    @inject<JwtUtility>(TYPES.JwtUtility) private jwtUtility: JwtUtility) {
  }

  async refreshToken(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    if (!user) {
      return res.status(401).send();
    } else {
      const accessToken = await this.jwtUtility.createJWT({
        id: user.id,
        login: user.credentials.login
      }, "10d");
      const refreshToken = await this.jwtUtility.createUserJWT({
        id: user.id,
        login: user.credentials.login,
        email: user.credentials.email
      }, "20d");
      //res.cookie("refreshToken", refreshToken);
      res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true});

      return res.status(200).send({accessToken});
    }
  }

  async login(req: Request, res: Response) {
    const credentials: LoginType = {
      login: req.body.login,
      password: req.body.password
    }

    const result = await this.authService.login(credentials, "10d");
    if (result) {
      const {accessToken, user} = result;

      const refreshToken = await this.jwtUtility.createUserJWT({
        id: user.id,
        login: user.credentials.login,
        email: user.credentials.email
      }, "20d");
      res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true})
      //res.cookie("refreshToken", refreshToken);
      return res.status(200).send({accessToken});
    }
    return res.status(401).send()
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return res.status(204).send();
  }

  async registration(req: RequestWithInternetData, res: Response) {
    const credentials: CredentialType = {
      login: req.body.login,
      email: req.body.email,
      password: req.body.password
    }
    const result = await this.authService.registration(credentials);
    if (result) {
      return res.status(204).send();
    }
    return res.status(401).send();
  }

  async registrationEmailResending(req: RequestWithInternetData, res: Response) {
    const {email} = req.body;
    const isEmailResent = await this.authService.emailResending(email);
    if (isEmailResent) {
      return res.status(204).send();
    }
    return res.status(400).send();
  }

  async registrationConfirmation(req: RequestWithInternetData, res: Response) {
    const {code} = req.body;
    const isConfirmed = await this.authService.emailConfirmedByCode(code);
    if (isConfirmed) {
      return res.status(204).send();
    }
    return res.status(400).send();

  }

  async me(req: RequestWithFullUser, res: Response) {
    const user = req.user;

    if (!user)
      return res.status(401).send();

    const result = {
      userId: user.id,
      login: user.credentials.login,
      email: user.credentials.email
    }

    res.status(200).send(result);

  }
}