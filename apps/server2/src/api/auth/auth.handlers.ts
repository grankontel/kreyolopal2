import { Context } from 'hono'
import config from '../../config'
import { createHttpException } from '../../utils/createHttpException'

const login = async function (c: Context) {
    const logger = c.get('logger')
    const client = c.get('pgdb')

    const {email, password} = c.get('body')
    console.log({email, password} )
    return c.json({email, password})
}

const logout = async function (c: Context) {
    const logger = c.get('logger')
    const client = c.get('pgdb')
}

export default {login, logout}