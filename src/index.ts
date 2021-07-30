import server, { connectToDB } from './server'
const PORT = process.env.PORT ?? 3000

connectToDB().then(() => {
// Porta do Servidor
  server.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`)
  })
})
