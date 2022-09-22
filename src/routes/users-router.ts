import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-services";
import {CredentialType, UserInputType} from "../db/types";
import {authBasicValidationMiddleware} from '../middlewares/basicAuth/authValidationMiddleware'
import {
  userAlreadyExistMiddleware,
  userCreateValidationMiddleware,
  userAlreadyNotExistMiddleware
} from "../middlewares/users/usersMiddleware";
import {jwtUtility} from "../application/jwt-utility";

export const usersRouter = Router({});

class UsersController {
  async createUser(req: Request, res: Response) {
    const credentials: CredentialType = {login: req.body.login, email: req.body.email, password: req.body.password}
    const newUser = await usersService.create(credentials);
    const refreshToken = await jwtUtility.createUserJWT({
      id: newUser.id,
      login: newUser.credentials.login,
      email: newUser.credentials.email
    }, "20d");
    //res.cookie("refreshToken", refreshToken)
    res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true})
    const {id, credentials: {login}} = newUser;
    res.status(201).send({id, login})
  }

  async deleteUser(req: Request, res: Response) {
    const isDeleted = await usersService.delete(req.params.id);
    if (isDeleted) {
      res.status(204).send()
    }
    res.status(404).send()
  }

  async getUsers(req: Request, res: Response) {
    const searchUsers: UserInputType = {
      pageNumber: +(req.query.PageNumber ? req.query.PageNumber : 1),
      pageSize: +(req.query.PageSize ? req.query.PageSize : 10)
    }
    const users = await usersService.getAll(searchUsers)
    res.send(users)
  }
}

const usersController = new UsersController()

usersRouter.post("/",
  authBasicValidationMiddleware,
  userCreateValidationMiddleware,
  userAlreadyExistMiddleware,
  usersController.createUser);

usersRouter.delete("/:id",
  authBasicValidationMiddleware,
  userAlreadyNotExistMiddleware,
  usersController.deleteUser)

usersRouter.get('/', usersController.getUsers);