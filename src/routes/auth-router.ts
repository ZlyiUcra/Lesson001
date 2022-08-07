import {Request, Response, Router} from "express";
import {LoginType} from "../db/types";
import {authService} from "../domain/auth-services";
import {loginAndPassValidationMiddleware} from "../middlewares/auth/loginAndPassValidationMiddleware";

export const authRouter = Router({});

authRouter.post('/login', loginAndPassValidationMiddleware, async (req: Request, res: Response) => {
  const credentials: LoginType = {
    login: req.body.login || "",
    password: req.body.password || ""
  }

  const token = await authService.login(credentials);

  if(token !== null) {
    return res.status(200).send(token)
  }
  res.status(401).send();
});