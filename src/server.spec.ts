import server, { connectToDB } from './server'
import supertest from 'supertest'
const testServer = supertest(server)
let connection
beforeAll(async () => {
  connection = await connectToDB()
})
afterAll(async () => {
  await connection.synchronize(true)
})

export { testServer }
