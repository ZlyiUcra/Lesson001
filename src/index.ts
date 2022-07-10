const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const helloMessage = 'Hello Incubator!!!';
  res.send(helloMessage)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})