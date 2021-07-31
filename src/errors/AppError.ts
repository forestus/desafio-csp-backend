// Interface de Erros, formata o Lançamento de Erros que será pego na Middleware de Erros passando statusCode e message.
export class AppError {
  public readonly message: string | string[] | any

  public readonly statusCode: number

  constructor (message: string | string[] | any, statusCode?: number) {
    if (!statusCode) {
      statusCode = 400
    }
    this.message = message
    this.statusCode = statusCode
  }
}
