import express from 'express'
import router from './routes/index.routes.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(router)

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
