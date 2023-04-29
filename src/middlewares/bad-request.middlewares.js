export function badRequest(err, req, res, next) {
  const { code, sqlMessage } = err

  if (code !== 'ER_DUP_ENTRY') {
    next(err)
  }
  console.error(err)

  res.status(400)
  res.json({ code, sqlMessage })
}
