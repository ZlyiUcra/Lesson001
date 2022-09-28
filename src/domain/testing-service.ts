//import {testingRepository} from "../repositories/testing-repository"

import {inject, injectable} from "inversify";
import {TestingRepository} from "../repositories/testing-repository";
import {TYPES} from "../db/iocTypes";

@injectable()
export class TestingServices {
  constructor(
    @inject<TestingRepository>(TYPES.TestingRepository) private testingRepository: TestingRepository
  ) {
  }
  async deleteAll(): Promise<boolean> {
    return this.testingRepository.deleteAll()
  }
}

//export const testingServices = new TestingServices()