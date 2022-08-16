import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-services";
import {CredentialType, LoginType, UserInputType} from "../db/types";
import {authBasicValidationMiddleware} from '../middlewares/basicAuth/authValidationMiddleware'
import {userValidationMiddleware} from "../middlewares/users/userValidationMiddleware";

export const usersRouter = Router({});

usersRouter.get('/', async (req: Request, res: Response) => {
  const searchUsers: UserInputType = {
    pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 0),
    pageSize: +(req.query.PageSize ? req.query.PageSize : 0)
  }
  const users = await usersService
    .getAllUsers(searchUsers)
  res.send(users)
});

usersRouter.post("/",
  authBasicValidationMiddleware,
  userValidationMiddleware,
  async (req: Request, res: Response) => {
    const credentials: CredentialType = {login: req.body.login, email: req.body.email, password: req.body.password}
    const newUser = await usersService.create(credentials);
    res.status(201).send(newUser)
  });

usersRouter.delete("/:id", authBasicValidationMiddleware, async (req: Request, res: Response) => {
  const isDeleted = await usersService.delete(req.params.id);
  if (isDeleted) {
    res.status(204).send()
  }
  res.status(404).send()
})