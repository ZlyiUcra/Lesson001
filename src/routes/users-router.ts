import "reflect-metadata";
import {Router} from "express";
import {authBasicValidationMiddleware} from '../middlewares/basicAuth/authValidationMiddleware'
import {
  userAlreadyExistMiddleware,
  userAlreadyNotExistMiddleware,
  userCreateValidationMiddleware
} from "../middlewares/users/usersMiddleware";
import "reflect-metadata";
import {rootContainer} from "../ioc/compositionRoot";
import {UsersController} from "../controllers/users-controller";

const usersController = rootContainer.resolve(UsersController)

export const usersRouter = Router({});

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