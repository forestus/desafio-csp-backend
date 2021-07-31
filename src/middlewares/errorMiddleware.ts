import { AppError } from '@errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup'
import translate from '@vitalets/google-translate-api'
async function errorMiddleware (
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<Response> {
  // caso o Erro seja uma Instancia do Erro de Validação do Yup ele filtra e devolve uma mensagem, caso o erro não seja do tipo "typeError" ele traduz e retorna o erro,
  // caso não seja um "typeError" ele traduz e retorna.
  if (err instanceof ValidationError) {
    if (err.inner[0].type === 'typeError') {
      return response
        .json({
          error: await Promise.all(
            err.inner.map(async (error) => {
              if (error.type === 'typeError') {
                return `O Parametro passado "${(error.value as string)}" não condiz com o tipo Necessário!`
              } else {
                return await Promise.all(
                  err.errors.map(async (error) => {
                    const translateToPt = await translate(error, { to: 'pt' })
                    return translateToPt.text
                  })
                )
              }
            })
          )
        })
        .status(400)
    } else {
      return response.status(400).json({
        error: await Promise.all(
          err.errors.map(async (error) => {
            const translateToPt = await translate(error, { to: 'pt' })
            return translateToPt.text
          })
        )
      })
    }
  }
  // caso seja uma instancia de AppError ele formata o Error e retorna o mesmo.
  if (err instanceof AppError) {
    // Error Handling em teste, caso o nome do error seja QueryFailedError do typeorm ele ira retornar apenas a mensagem de erro com details ou message.
    if (typeof err.message.message !== 'undefined' && err.message.message.name === 'QueryFailedError') {
      const error = { ...err.message.message }
      return response.status(err.message.statusCode || err.statusCode).json({
        error: [error.detail ? error.detail : error.message]
      })
    }
    return response.status(err.message.statusCode || err.statusCode).json({
      error: [err.message.message ? err.message.message : err.message]
    })
  }
  // caso não seja nenhuma das Instancias acima ele retorna o Erro 500 e a mensagem no corpo.
  return response.status(500).json({
    error: `Erro Interno do Servidor! - ${err.message}`
  })
}
export { errorMiddleware }
