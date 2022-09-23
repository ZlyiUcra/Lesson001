import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-services";
import {testingServices} from "../domain/testing-service";

export const testingRouter = Router({});

class TestingController {
  async allData(req: Request, res: Response) {
    if (await testingServices.deleteAll())
      return res.status(204).send();
    res.status(400).send();
  }
}

const testingController = new TestingController()

testingRouter.delete('/all-data', testingController.allData)