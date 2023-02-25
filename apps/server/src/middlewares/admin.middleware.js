import logger from '../services/logger'

function adminMiddleware(req, res, next) {
    if (!req.user?.is_admin) {
      logger.error(`${req.user?.firstname} ${req.user?.lastname} is not admin`)
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        error: new Error('Unauthorized'),
      })
    }
    next()
  }

  export default adminMiddleware