import dotenv from 'dotenv'
dotenv.config()

const config = {
  app: {
    port: process.env.PORT,
  },
  dico: {
    useLocal: process.env.LOCAL_DICO,
  },
  slack: {
    webhook: process.env.SLACK_WEBHOOK_URL,
    noSend: process.env.NODE_ENV !== 'production',
  },
  aws: {
    keyId: process.env.AWS_ACCESS_KEY_ID,
    keySecret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  db: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
  },
  mongodb: {
    // uri: process.env.MONGODB_URI,
    host: process.env.MONGODB_HOST,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    db: process.env.MONGODB_DB,
    port: Number(process.env.MONGODB_PORT || 27017),
    uri: '',
  },
  redis: {
    url: process.env.REDIS_URL,
    db: process.env.REDIS_DB,
  },
  mail: {
    webmaster: process.env.MAINTAINTER_EMAIL,
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST,
    from: process.env.MAILGUN_FROM,
    listKey: process.env.MAILIST_API_KEY,
    listId: process.env.MAILIST_LISTID,
  },
  security: {
    salt: process.env.API_SALT,
    token: process.env.TOKEN_SALT,
    adminSecret: process.env.PGRST_JWT_SECRET,
    memoryCost: Number(process.env.ARGON_MEMORYCOST || 24),
    hashLength: Number(process.env.ARGON_LENGTH || 24),
    iterations: Number(process.env.ARGON_ITERATIONS || 2),
    captchaKey: process.env.CAPTCHA_SECRET_KEY,
  },
  log: {
    level: process.env.LOGLEVEL || 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
  },
  auth: {
    secret: process.env.SESSION_SECRET,
    duration: process.env.SESSION_DURATION,
  },
}

config.mongodb.uri = `mongodb://${config.mongodb.user}:${encodeURIComponent(
  String(config.mongodb.password)
)}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`

export default config
