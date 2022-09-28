import "reflect-metadata";
import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {TestingServices} from "../domain/testing-service";
import {TYPES} from "../db/iocTypes";

@injectable()
export class TestingController {
  constructor(
    @inject<TestingServices>(TYPES.TestingServices) private testingServices: TestingServices
  ) {
  }
  async allData(req: Request, res: Response) {
    if (await this.testingServices.deleteAll())
      return res.status(204).send();
    res.status(400).send();
  }
}