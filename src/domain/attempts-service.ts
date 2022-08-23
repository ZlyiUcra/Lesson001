import {AttemptsType} from "../db/types";
import {attemptsRepository} from "../repositories/attempts-repository";

export const attemptsService = {
  async resetCounter(attempt: AttemptsType): Promise<boolean> {
    return  attemptsRepository.resetCounter(attempt);
  },
  async incrementCounter(attempt: AttemptsType): Promise<boolean> {
    return  attemptsRepository.incrementCounter(attempt);
  },
  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return  attemptsRepository.find(ip, url, method)
  }
}