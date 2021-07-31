import { testServer } from '../server.spec'

describe('ContactController', () => {
  // A rota create dos contatos deve ter o retorno 200 e a resposta Objeto se post /contacts
  test('Contacts create Route should be return 200 and response if get /contacts with id params', async () => {
    await testServer.post('/contacts')
      .set('Accept', 'application/json')
      .send(
        {
          firstname: 'Guilherme',
          lastname: 'Maciel',
          email: 'forestus7@gmail.com',
          phones: ['+5522998975749']
        }
      )
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(201)
        expect(typeof response.body).toBe('object')
      })
  })
  // A rota find dos contatos deve ter o retorno 200 e a resposta Array de Objetos se get /contacts
  test('Contacts find Route should be return 200 and response if get /contacts', async () => {
    await testServer.get('/contacts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
        expect(typeof Array(response.body)[0]).toBe('object')
      })
  })
  // A rota findOne dos contatos deve ter o retorno 200 e a resposta Objeto se get /contacts passando ID
  test('Contacts findOne Route should be return 200 and response if get /contacts with id params', async () => {
    await testServer.get('/contacts/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })
  // A rota update dos contatos deve ter o retorno 200 e a resposta Objeto se put /contacts passando ID
  test('Contacts update Route should be return 200 and response if get /contacts with id params', async () => {
    await testServer.put('/contacts/1')
      .set('Accept', 'application/json')
      .send(
        {
          firstname: 'Grazielle',
          lastname: 'Fiuza',
          email: 'forestusgame7@gmail.com',
          phones: ['+5522998977777']
        }
      )
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe('object')
      })
  })

  // A rota update dos contatos deve ter o retorno 200 e a resposta Objeto se put /contacts passando ID
  test('Contacts updatePhone Route should be return 200 and response if get /contacts with id params', async () => {
    await testServer.put('/contacts/phone/1')
      .set('Accept', 'application/json')
      .send(
        {
          phones: ['+5522998933333', '+5522998944444']
        }
      )
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
        expect(typeof response.body).toBe('object')
      })
  })

  // A rota delete dos telefones deve ter o retorno 200 /contacts passando ID
  test('Phones delete Route should be return 200 and response if get /contacts with id params', async () => {
    await testServer.delete('/contacts/phone/1')
      .set('Accept', 'application/json')
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })

  // A rota delete dos contatos deve ter o retorno 200 /contacts passando ID
  test('Contacts delete Route should be return 200 and response if get /contacts with id params', async () => {
    await testServer.delete('/contacts/1')
      .set('Accept', 'application/json')
      .expect(async (response) => {
        JSON.stringify(response)
        expect(response.status).toBe(200)
      })
  })
})
