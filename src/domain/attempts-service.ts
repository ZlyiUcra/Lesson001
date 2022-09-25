import "reflect-metadata";
import {AttemptsType} from "../db/types";
//import {attemptsRepository} from "../repositories/attempts-repository";
import {inject, injectable} from "inversify";
import {AttemptsRepository} from "../repositories/attempts-repository";
import {TYPES} from "../db/iocTypes";

@injectable()
export class AttemptsService {
  constructor(
    @inject<AttemptsRepository>(TYPES.AttemptsRepository) private attemptsRepository: AttemptsRepository
  ){}
  async updateRequests(attempt: AttemptsType): Promise<boolean> {
    return this.attemptsRepository.updateRequests(attempt);
  }

  async find(ip: string, url: string, method: string): Promise<AttemptsType> {
    return this.attemptsRepository.find(ip, url, method)
  }
}