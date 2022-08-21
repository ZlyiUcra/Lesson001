import {AttemptsType} from "../db/types";
import {attemptsRepository} from "../repositories/attempts-repository";

export const attemptsService = {
  async update(ip: string, url: string, method: string, limitTimeCount?: number): Promise<boolean> {
    return  attemptsRepository.update(ip, url, method, limitTimeCount);
  },
  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return  attemptsRepository.find(ip, url, method)
  }
}