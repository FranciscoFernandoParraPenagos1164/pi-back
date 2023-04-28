import { pool } from '../connection.js'

export async function getClientes(req, res) {
  pool
    .query('SELECT * FROM cliente')
    .then(([rows]) => {
      res.status(200)
      res.json(rows)
    })
    .catch(console.error)
}
