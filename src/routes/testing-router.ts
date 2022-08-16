import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-services";
import {testingServices} from "../domain/testing-service";

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  if (await testingServices.deleteAll())
    return res.status(204).send();
  res.status(400).send();
})