import 'reflect-metadata'
import 'express-async-errors'
import express, { Application, Request, Response } from 'express'
import { errorMiddleware } from '@middlewares/errorMiddleware'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import routes from '@routes/index'
import createConnection from '@database/index'
import swaggerJsDoc, { Options } from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import swaggerConfig from '@docs/config/swaggerConfig.json'
import { Connection } from 'typeorm'
// Configuração do Swagger
const swaggerOptions: Options = swaggerConfig
const swaggerDocs = swaggerJsDoc(swaggerOptions)

async function connectToDB (): Promise<Connection> {
  // inicia a Conexão com o Banco e quando termina Inicia a Configuração do Servidor.
  const connection = await createConnection()
  return connection
}
function server (): Application {
  // Configuração do Servidor
  const server: Application = express()
  server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
  server.use(express.json())
  server.use(cors())
  server.use(helmet())
  server.use(morgan('tiny'))
  server.use(routes)
  server.use(errorMiddleware)
  // Redireciona para a Documentação caso o Usuário abra a Home.
  server.get('/', (request: Request, response: Response) => {
    response.redirect('/api-docs')
  })
  return server
}
// Exporta a Aplicação
export default server()
// Exporta a Conexão com o Banco
export { connectToDB }
