export function getIndex(req, res) {
  res.status(200)
  res.send('welcome to the enfercuidarte api')
}

export function getName(req, res) {
  const { name } = req.params
  res.status(200)
  res.send(`hello ${name}, welcome to the enfercuidarte api`)
}
