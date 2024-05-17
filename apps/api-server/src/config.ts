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
}

config.db.uri = `postgresql://${config.db.username}:${encodeURIComponent(
	String(config.db.password)
)}@${config.db.host}:${config.db.port}/${config.db.database}`


export default config
