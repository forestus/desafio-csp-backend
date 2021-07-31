import { AppError } from '@errors/AppError'
import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'
import 'yup-phone'
// Midleware de Validação de Contatos.
// Valida os dados passados para o Controller de Contatos.
// Cada metodo com suas respectivas entradas.
// Caso "required" e "strict: true",
// a entrada de dados será Obrigatória e o tipo estrito se não forem passados de forma correta retorna uma mensagem e status de erro correspondente.
class ContactValidator {
  async validateStore (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { firstname, lastname, email, phones } = request.body
    const schema = yup.object().shape({
      firstname: yup.string().required('Nome Não Informado!'),
      lastname: yup.string().required('Sobrenome Não Informado!'),
      email: yup.string().email().required('Email Não Informado!'),
      phones: yup.array().of(yup.string().phone().required('Telefone Não Informado!')).required('Telefone Não Informado!') // apenas verifica caso seja passado um valor ou " " vazio
      // phones: yup.lazy(val => (Array.isArray(val) ? yup.array().of(yup.string()) : yup.string())) // caso mude para Array/string
    })
    // check validity
    await schema.validate(
      {
        firstname, lastname, email, phones
      },
      { abortEarly: false, strict: true }
    )
    // caso nao tenha itens na array de telefones ele retorna mensagem e status de erro.
    if (phones.length === 0) {
      throw new AppError('Telefone Não Informado!', 400)
    }
    next()
  }

  async validateUpdate (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { firstname, lastname, email } = request.body
    const { id } = request.params
    const schema = yup.object().shape({
      id: yup.string().required('ID Não Informado!'),
      firstname: yup.string(),
      lastname: yup.string(),
      email: yup.string().email()
    })
    // check validity
    await schema.validate(
      {
        id, firstname, lastname, email
      },
      { abortEarly: false, strict: true }
    )
    if (typeof firstname === 'undefined' && typeof lastname === 'undefined' && typeof email === 'undefined') {
      throw new AppError('Os Dados do Contato Não foram Informados!', 400)
    }
    next()
  }

  async validateUpdatePhone (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const { phone } = request.body
    const { id } = request.params
    const schema = yup.object().shape({
      id: yup.string().required('ID Não Informado!'),
      phones: yup.array().of(yup.string().required('Telefone Não Informado!'))
    })
    // check validity
    await schema.validate(
      {
        id, phone
      },
      { abortEarly: false, strict: true }
    )
    next()
  }

  async validateFindAll (request: Request, response: Response, next: NextFunction): Promise<void> {
    const { name, email } = request.params
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email()
    })
    // check validity
    await schema.validate({ name, email }, { abortEarly: false, strict: true })
    next()
  }

  async validateId (request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params
    const schema = yup.object().shape({
      id: yup.string().required('ID Não Informado!')
    })
    // check validity
    await schema.validate({ id }, { abortEarly: false, strict: true })
    next()
  }
}
export default new ContactValidator()
