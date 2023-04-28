import { pool } from '../connection.js'

export async function getClientes(req, res) {
  res.send('listando clientes')
  pool.query('SELECT * FROM cliente', (err, rows, fields) => {
    console.log(err)
    console.log(rows)
    console.log(fields)
  })
}
