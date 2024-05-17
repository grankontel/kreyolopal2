import { setDefaultPermissions } from "#services/def_perm";
import { program } from "commander";

program
	.name("kreyolopal-cli")
	.version("1.0.0", '-v, --version')
	.description("Kreyolopal API Server")
	.command('perms')
	.description('Set default permissions')
	.action(async () => {
		await setDefaultPermissions()
		console.log('Default permissions inserted')
	})

program.parse(process.argv);