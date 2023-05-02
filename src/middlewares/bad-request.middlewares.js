export function badRequest(err, req, res, next) {
  const { code, sqlMessage } = err

  const validErrors = ['ER_DUP_ENTRY', 'NON_MODIFICABLE_PROPERTY']

  if (!validErrors.includes(code)) {
    next(err)
    return
  }

  console.log(err)
  res.status(400)
  res.json({ code, sqlMessage })
}
