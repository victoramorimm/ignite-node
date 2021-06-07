const { json } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();
app.use(json())

const customers = []

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer) {
    return response.status(400).json({ error: 'Customer não encontrado pelo cpf.' })
  }

  request.customer = customer

  next()
}

async function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount
    } else {
      return acc - operation.amount
    }
  }, 0)

  return balance;
}

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

app.get('/statement', verifyIfExistsAccountCPF,  (request, response) => {
  const { customer } = request

  return response.status(200).json(customer.statement)
})

app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body
  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  }

  customer.statement.push(statementOperation);

  return response.status(201).json({ message: 'Depósito realizado com sucesso!' });
})

app.post('/withdraw', verifyIfExistsAccountCPF, async (request, response) => {
  const { amount } = request.body
  const { customer } = request

  const balance = await getBalance(customer.statement);

  if (amount > balance) {
    return response.status(400).json({ error: 'O valor do saque é maior que o saldo da conta.' })
  }

  const statementOperation = {
    description: 'Withdraw',
    amount,
    created_at: new Date(),
    type: 'debit'
  }

  customer.statement.push(statementOperation);

  return response.status(201).json({ message: 'Saque realizado com sucesso!' });
})

app.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request
  const { date } = request.query

  const dateFormat = new Date(date + ' 00:00');

  const statement = customer.statement.filter(
    (statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString()
  )

  return response.status(200).json(statement)
})

app.put('/account', verifyIfExistsAccountCPF, (request, response) => {
  const { name } = request.body
  const { customer } = request

  customer.name = name;

  return response.status(201).send()
})

app.get('/account', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request

  return response.json(customer)
})

app.delete('/account', verifyIfExistsAccountCPF ,(request, response) => {
  const { customer } = request

  customers.splice(customer, 1);

  return response.status(200).json(customers)
})

app.get('/balance', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request

  const balance = getBalance(customer.statement);

  return response.json(balance)
})

app.listen(3333);