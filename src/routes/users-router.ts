import {Request, Response, Router} from "express";
import {CredentialType, UserInputType, UserJWTType} from "../db/types";
import {authBasicValidationMiddleware} from '../middlewares/basicAuth/authValidationMiddleware'
import {
  userAlreadyExistMiddleware,
  userCreateValidationMiddleware,
  userAlreadyNotExistMiddleware
} from "../middlewares/users/usersMiddleware";
import {UsersServices} from "../domain/users-services";
import {JwtUtility} from "../application/jwt-utility";

export const usersRouter = Router({});

class UsersController {
  private usersServices: UsersServices;
  private jwtUtility: JwtUtility;

  constructor() {
    this.usersServices = new UsersServices();
    this.jwtUtility = new JwtUtility();
  }

  async createUser(req: Request, res: Response) {
    const credentials = new CredentialType(req.body.login, req.body.email, req.body.password)
    const newUser = await this.usersServices.create(credentials);
    const refreshToken = await this.jwtUtility.createUserJWT(
      new UserJWTType(newUser.id, newUser.credentials.login, newUser.credentials.email),
      "20d");
    res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: true})
    const {id, credentials: {login}} = newUser;
    res.status(201).send({id, login})
  }

  async deleteUser(req: Request, res: Response) {
    const isDeleted = await this.usersServices.delete(req.params.id);
    if (isDeleted) {
      res.status(204).send()
    }
    res.status(404).send()
  }

  async getUsers(req: Request, res: Response) {
    const pageNumber = +(req.query.PageNumber ? req.query.PageNumber : 1);
    const pageSize = +(req.query.PageSize ? req.query.PageSize : 10);

    const searchUsers = new UserInputType(pageNumber, pageSize)
    const users = await this.usersServices.getAll(searchUsers)
    res.send(users)
  }
}

const usersController = new UsersController()

usersRouter.post("/",
  authBasicValidationMiddleware,
  userCreateValidationMiddleware,
  userAlreadyExistMiddleware,
  usersController.createUser.bind(usersController));

usersRouter.delete("/:id",
  authBasicValidationMiddleware,
  userAlreadyNotExistMiddleware,
  usersController.deleteUser.bind(usersController))

usersRouter.get('/', usersController.getUsers.bind(usersController));