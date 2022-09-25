import {inject, injectable} from "inversify";


@injectable()
export class EmailMessage {
  getMessage(confirmationToken: string): string {
    return `<a href="https://it-kamasutra-lesson-01.herokuapp.com/auth/registration-confirmation/?code=${confirmationToken}">${confirmationToken}</a>`
  }
}