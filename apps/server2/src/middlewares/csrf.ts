// import { verifyRequestOrigin } from 'lucia'
import type { MiddlewareHandler } from 'hono'
import { winston_logger } from '#services/winston_logger'

function domain_from_url(url) {
  var result
  var match
  if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
      result = match[1]
      if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
          result = match[1]
      }
  }
  return result
}

export function verifyRequestOrigin(origin: string, allowedDomains: string[]): boolean {
	if (!origin || allowedDomains.length === 0) return false;
	const originHost = safeURL(origin)?.host ?? null;

  if (!originHost) return false;
	for (const domain of allowedDomains) {
		let host: string | null;
		if (domain.startsWith("http://") || domain.startsWith("https://")) {
			host = safeURL(domain)?.host ?? null;

    } else {
			host = safeURL("https://" + domain)?.host ?? null;
		}
    console.log({originDomain: domain_from_url(originHost), hostDomain: domain_from_url(originHost)})
		if (domain_from_url(originHost) === domain_from_url(host)) return true;
	}
	return false;
}

function safeURL(url: URL | string): URL | null {
	try {
		return new URL(url);
	} catch {
		return null;
	}
}

export const csrfMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    // CSRF middleware
    if (c.req.method === 'GET') {
      return next()
    }
    const originHeader = c.req.header('Origin')
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = c.req.header('Host')
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      winston_logger.warning(`invalid request origin from host: ${hostHeader}, origin: ${originHeader}`)
      return c.body(null, 403)
    }
    return next()
  }
}
