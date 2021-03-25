const express = require('express')
const app = express();
const fs = require('fs')
const https = require('https')
const path = require('path')


app.use(express.static(path.join(__dirname, 'www/'))).listen(80);

https
  .createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/samwebapp.ddns.net/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/samwebapp.ddns.net/cert.pem'),
      ca: fs.readFileSync('/etc/letsencrypt/live/samwebapp.ddns.net/chain.pem'),
    },
    app
  )
  .listen(443, () => {
    console.log('Listening...')
  })

