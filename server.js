const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')))
app.post('/api', (req, res) => {
  const vals = [
    {id: 'One', text: 'Label One'},
    {id: 'Two', text: 'Label Two'},
    {id: 'Three', text: 'Label Three'}
  ]
  const q = req.body.query
  let vf = vals.filter(v => {
    let vid = v.id.toLowerCase()
    if (vid.indexOf(q.toLowerCase()) > -1) {
      return v
    }
  })
  res.json(vf)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))