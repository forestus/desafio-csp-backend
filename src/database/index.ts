import { createConnection, getConnectionOptions, Connection } from 'typeorm'
export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions()
  // Cria a Conexão com o Banco de Dados, default Options representa as configurações passadas no ormconfig.json.
  // Caso necessário é possível inserir um banco de teste apenas passando o nome e configurando a enviroment.
  const connection = await createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'teste' // variavel passada ao rodar aplicação
          ? 'teste-db' // nome do banco
          : defaultOptions.database
    })
  ).then(async (connection) => {
    // local para executar ações no banco antes da execução da aplicação.
    return connection
  })
  return connection
}
