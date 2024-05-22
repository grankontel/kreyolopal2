import dotenv from 'dotenv'
dotenv.config()

const config = {
  app: {
    port: Number(process.env.PORT),
  },
  log: {
    level: process.env.LOGLEVEL || 'info',
    prettyPrint: Boolean(process.env.NODE_ENV !== 'production'),
  },
  slack: {
    webhook: String(process.env.SLACK_WEBHOOK_URL),
    noSend: Boolean(process.env.NODE_ENV !== 'production'),
  },
  db: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    health: process.env.PGRST_HEALTH as string,
    uri: '',
  },
  security: {
    salt: process.env.API_SALT,
    token: process.env.TOKEN_SALT,
    adminSecret: process.env.PGRST_JWT_SECRET as string,
    memoryCost: Number(process.env.ARGON_MEMORYCOST || 24),
    hashLength: Number(process.env.ARGON_LENGTH || 24),
    iterations: Number(process.env.ARGON_ITERATIONS || 2),
    // captchaKey: process.env.CAPTCHA_SECRET_KEY,
  },
  mail: {
    webmaster: process.env.MAINTAINER_EMAIL as string,
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    host: process.env.MAILGUN_HOST,
    from: process.env.MAILGUN_FROM,
    listKey: process.env.MAILIST_API_KEY,
    listId: process.env.MAILIST_LISTID,
  },
  mongodb: {
    // uri: process.env.MONGODB_URI,
    host: process.env.MONGODB_HOST,
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DB,
    port: Number(process.env.MONGODB_PORT || 27017),
    uri: '',
  },
  aws: {
    keyId: process.env.AWS_ACCESS_KEY_ID,
    keySecret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
}

config.db.uri = `postgresql://${config.db.username}:${encodeURIComponent(
  String(config.db.password)
)}@${config.db.host}:${config.db.port}/${config.db.database}`

config.mongodb.uri = `mongodb://${config.mongodb.username}:${encodeURIComponent(
  String(config.mongodb.password)
)}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}?replicaSet=rs0`

export default config
