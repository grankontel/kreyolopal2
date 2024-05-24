import { setDefaultPermissions, setDefaultRoles } from '#services/def_perm'
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

program
  .name('kreyolopal-cli')
  .version('1.0.0', '-v, --version')
  .description('Kreyolopal API Server')
  .addCommand(perms)
  .addCommand(roles)

program.parse(process.argv)
