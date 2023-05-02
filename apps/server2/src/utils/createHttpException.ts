import { Response } from 'node-fetch'
import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'

export function createHttpException(errorContent: object, status = 500,statusText = 'Internal server error'): HTTPException {
  const errorResponse = new Response(
    JSON.stringify(errorContent),
    {
        status, statusText
    }
  )

  return new HTTPException(status as StatusCode, {
    res: errorResponse,
  })
}
