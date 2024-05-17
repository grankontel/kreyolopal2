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
}
export default config
