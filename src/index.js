const { json } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();
app.use(json())

const customers = []

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const id = uuidv4();

  const isCostumerAlreadyInUse = customers.some((customer) => customer.cpf === cpf)

  if (isCostumerAlreadyInUse) {
    return response.status(400).json({ error: 'Cpf já está em uso.' })
  }

  customers.push({
    id,
    cpf,
    name,
    statement: []
  })

  return response.status(201).send('Conta criada com sucesso!');
})

app.get('/statement', (request, response) => {
  const { cpf } = request.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer) {
    return response.status(400).json({ error: 'Customer não encontrado pelo cpf.' })
  }

  return response.status(200).json(customer.statement)
})

app.listen(3333);