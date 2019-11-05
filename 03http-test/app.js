const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  res.setHeader['Content-type', 'application/json']
  const method = req.method
  const path = req.url.split('?')[0]
  const query = querystring.parse(req.url.split('?')[1])
  endData = {
    method,
    path,
    query
  }
  let postData = ''
  if (method === 'GET') {
    res.end(JSON.stringify(endData))
  }
  if (method === 'POST') {
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      endData.postData = postData
      res.end(JSON.stringify(endData))
    })
  }
})

server.listen(3000, () => {
  console.log('ok')
})