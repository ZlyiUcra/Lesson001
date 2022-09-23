import {testingRepository} from "../repositories/testing-repository"

export class TestingServices {
  async deleteAll(): Promise<boolean> {
    return testingRepository.deleteAll()
  }
}

export const testingServices = new TestingServices()