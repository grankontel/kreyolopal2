const { expressjwt: jwt } = require('express-jwt')
import config from '../config'

const jwtMiddleware = jwt({
  secret: config.security.token,
  algorithms: ['HS256'],
  //  credentialsRequired: false,
})

export default jwtMiddleware
