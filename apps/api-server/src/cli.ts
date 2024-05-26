import {
  rolesPermissions,
  setDefaultPermissions,
  setDefaultRoles,
} from '#services/def_perm'
import { migratePostgres } from '#services/migrate'
import { Command } from 'commander'

const program = new Command()

const perms = new Command('perms')
  .command('perms')
  .description('Set default permissions')
  .action(async () => {
    await setDefaultPermissions().then(() =>
      console.log('Default permissions inserted')
    )
  })

const roles = new Command('roles')
  .command('roles')
  .description('Set default roles')
  .action(async () => {
    await setDefaultRoles().then(() => 
      console.log('Default roles inserted')
    )
  })

const migrate = new Command('migrate')
  .command('migrate')
  .description('migrate to most up to date schema')
  .requiredOption('-d, --dir <directory>', 'Migrations directory')
  .action(async (options) => {
    await migratePostgres(options.dir).then(() => 
      console.log('migrated')
    )
  })

const rolePerms = new Command('rperms')
  .command('rperms')
  .description('set defaut role permissions')
  .action(async () => {
    await rolesPermissions().then(() =>
      console.log('default role permissions are set')
    )

  })
program
  .name('kreyolopal-cli')
  .version('1.0.0', '-v, --version')
  .description('Kreyolopal API Server')
  .addCommand(migrate)
  .addCommand(perms)
  .addCommand(roles)
  .addCommand(rolePerms)

program.parse(process.argv)
