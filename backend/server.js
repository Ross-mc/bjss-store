const express = require('express')
const api = require('./layers/api/wiring')

const config = { 
  port: process.env.PORT || 4001 
}

api.wire(express)
  .then(app => {
    // Start our server and make it listen 
    return app.listen(config.port, () =>
      console.log(`server listening on port ${config.port} try http://localhost:${config.port}/api-docs`)
    )
  })