import {AttemptsType} from "../db/types";
import {attemptsRepository} from "../repositories/attempts-repository";

export const attemptsService = {
  async updateRequests(attempt: AttemptsType): Promise<boolean> {
    return  attemptsRepository.updateRequests(attempt);
  },
  // async incrementCounter(attempt: AttemptsType): Promise<boolean> {
  //   return  attemptsRepository.incrementCounter(attempt);
  // },
  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return  attemptsRepository.find(ip, url, method)
  }
}