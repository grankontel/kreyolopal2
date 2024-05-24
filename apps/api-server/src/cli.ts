import { pgPool } from '#services/db'
import { setDefaultPermissions, setDefaultRoles } from '#services/def_perm'
import { argon2 } from '#utils/argon2'
import { Command } from 'commander'

const program = new Command()

const perms = new Command('perms')
  .command('perms')
  .description('Set default permissions')
  .action(async () => {
    await setDefaultPermissions()
    console.log('Default permissions inserted')
  })

const roles = new Command('roles')
  .command('roles')
  .description('Set default roles')
  .action(async () => {
    await setDefaultRoles()
    console.log('Default roles inserted')
  })

const password = new Command('password')
  .command('password')
  .description('Change user password')
  .requiredOption('-u, --username <username>', 'Username')
  .requiredOption('-p, --password <password>', 'Password')
  .action(async (options) => {
    const hashedPassword = await argon2.hash(options.password)
    const result = await pgPool.query('UPDATE auth_user SET password= $2 WHERE username = $1 RETURNING username', [
      options.username,
      hashedPassword,
    ])
    if (result.rows.length === 0) {
      console.log('User not found')
      return
    }
    console.log('Password changed')

  })
program
  .name('kreyolopal-cli')
  .version('1.0.0', '-v, --version')
  .description('Kreyolopal API Server')
  .addCommand(perms)
  .addCommand(roles)
  .addCommand(password)

program.parse(process.argv)
