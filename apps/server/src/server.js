import express from 'express'
import mongoose from 'mongoose'
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')

import setRoutes from './routes'
import config from './config'
import morganMiddleware from './middlewares/morgan.middleware'
import jwtMiddleware from './middlewares/jwt.middleware'
import logger from './services/logger'
import userService from './services/userService'

const jwt = require('jsonwebtoken')
const app = express()
const port = config.app.port || 3000

// app.use(helmet())
// trust proxy
app.enable('trust proxy')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(cookieParser(config.security.salt))
app.use(bodyParser.urlencoded({ extended: true }))
// body parser
app.use(express.json())

// Add the morgan middleware
app.use(morganMiddleware)

// Add the jwt middleware
app.use(
  '/api',
  jwtMiddleware.unless({
    path: [
      '/api/contact',
      '/api/auth/login',
      '/api/auth/register',
      /dictionary/,
      // /words/,
    ],
  }),
  async function (req, res, next) {
    if (req.auth) {
      await userService.findbyEmail(req.auth.user.email).then((r) => {
        req.user = r.get({ plain: true })
      })
    }
    next()
  }
)

setRoutes({ app })

const CLIENT_BUILD_PATH = path.join(__dirname, '../public')

// serve static assets
app.get(
  /\.(js|css|map|webmanifest|json|xml|txt|svg|png|webp|jpeg|ico)$/,
  express.static(CLIENT_BUILD_PATH)
)

// for any other requests, send `index.html` as a response
app.get(/^(?!\/(api|backend))(.+)/, (request, response) => {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'))
})

// errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    logger.error(err)
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      error: new Error('Unauthorized'),
    })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  // Do logging and user-friendly error message display
  logger.error(err)

  return res.status(500).json({
    status: 'error',
    code: 500,
    message: 'internal error',
    error: new Error('internal error'),
  })
})

app.use((req, res) =>
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not Found',
    error: new Error('Not Found'),
  })
)

// If SIGINT process is called then this will
// run first then the next line
/* process.on('SIGINT', () => {
  console.log('Hey Boss I just Received SIGINT.');
  process.exit(0)
});
 */

mongoose.set('strictQuery', true);
process.stdout.write('🔌 connecting to mongo database...')
mongoose
  .connect(config.mongodb.uri, {
    serverSelectionTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    process.stdout.write(' connected !\n')
    app.listen(port, (err) => {
      if (err) {
        process.stdout.write(`\n❌ An error occured : ${err}\n\n`)
        process.exit(1)
      }
      process.stdout.write(
        `\n🚀 Your server is ready on http://localhost:${port}\n\n`
      )
    })
  },
  reason => {
    process.stdout.write(`\n❌ Cannot connect to mongo : ${reason}\n\n`)
    process.exit(1)

  }).catch((error) => {
    console.log(error)
    process.exit(1)
  }) 
