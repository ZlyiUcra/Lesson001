import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-services";
import {CredentialType, UserInputType} from "../db/types";
import {authBasicValidationMiddleware} from '../middlewares/basicAuth/authValidationMiddleware'
import {
  userAlreadyExistMiddleware,
  userCreateValidationMiddleware,
  userAlreadyNotExistMiddleware
} from "../middlewares/users/usersMiddleware";

export const usersRouter = Router({});

usersRouter.get('/', async (req: Request, res: Response) => {
  const searchUsers: UserInputType = {
    pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
    pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
  }
  const users = await usersService.getAll(searchUsers)
  res.send(users)
});

usersRouter.post("/",
  authBasicValidationMiddleware,
  userCreateValidationMiddleware,
  userAlreadyExistMiddleware,
  async (req: Request, res: Response) => {
    const credentials: CredentialType = {login: req.body.login, email: req.body.email, password: req.body.password}
    const newUser = await usersService.create(credentials);
    const {id, credentials: {login}} = newUser
    res.status(201).send({id, login})
  });

usersRouter.delete("/:id",
  authBasicValidationMiddleware,
  userAlreadyNotExistMiddleware,
  async (req: Request, res: Response) => {
  const isDeleted = await usersService.delete(req.params.id);
  if (isDeleted) {
    res.status(204).send()
  }
  res.status(404).send()
})