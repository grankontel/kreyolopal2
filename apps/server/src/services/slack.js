const { IncomingWebhook } = require('@slack/webhook')
const config = require('../config')

// Initialize
const slackWebhook = new IncomingWebhook(config.slack.webhook)

module.exports = slackWebhook
