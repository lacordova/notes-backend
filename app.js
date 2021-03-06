const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
require('colors')
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')


logger.info('conecting to:', `${config.MONGODB_URI}`.yellow)

mongoose.connect(config.MONGODB_URI, {useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{
    logger.info('conected to MongoDB'.blue)
  })
  .catch(error => {
    logger.error(`error connecting to MongoDB: ${error.message}`.red)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use('/api/login', loginRouter)
app.use(middleware.requestLogger)
app.use('/api/users',usersRouter)
app.use('/api/notes',notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app