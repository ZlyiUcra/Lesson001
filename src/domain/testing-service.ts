import { testingRepository } from "../repositories/testing-repository"

export const testingServices = {
  async deleteAll(): Promise<boolean>{
    return testingRepository.deleteAll()
  }
}