import * as Sentry from "@sentry/node";

import config from '#config'

Sentry.init({
	dsn: config.sentry.dsn,
	environment: process.env.NODE_ENV !== 'production' ? "development" : "production",
	release: process.env.GIT_COMMIT_HASH,
	integrations: [...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()],
	tracesSampleRate: 1.0,
});

export const sentry = Sentry;