//requiring path and fs modules
const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar');

//joining path of directory 
const directoryPath = path.join(__dirname, './src');
const componentsPath = path.join(__dirname, './build');

if (!fs.existsSync(componentsPath)) {
	fs.mkdir(componentsPath, function (err, files) {
		//handling error
		if (err) {
			if (err) throw err;
		}
	})
}

function createComponent(srcFile) {
	const sourceFilePath = path.join(directoryPath, '/', srcFile)
	const radix = srcFile.substring(0, srcFile.lastIndexOf("."))
	const componentName = 'get' + radix[0]?.toUpperCase() + radix.slice(1);
	const dstFileName = radix + ".ts";
	const dstFilePath = path.join(componentsPath, '/', dstFileName)

	const content = fs.readFileSync(sourceFilePath,
		{ encoding: 'utf8', flag: 'r' });

	const dstContent = `
	import mustache from 'mustache';
	import mjml from 'mjml'
	import { htmlToText } from 'html-to-text'
	import type { mailTemplateFunction } from './types';
	
	const template = \`
	${content}
	\`
	
	export const ${componentName}: mailTemplateFunction = (templateData: any) => {
		const renderedMjml = mustache.render(template, templateData)
	
		const { html } = mjml(renderedMjml)
		const text = htmlToText(html, { wordwrap: 130 })
	
		return { html, text };
	}

	${componentName}.sourceName = '${srcFile}'
	`

	fs.writeFileSync(dstFilePath, dstContent)
	return ({ component: componentName, file: radix })
}

function build(isInitial) {
	//passsing directoryPath and callback function
	fs.readdir(directoryPath, function (err, files) {
		//handling error
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}

		//listing all files using forEach
		const components = files
			.filter((file) => {
				return path.extname(file).toLocaleLowerCase() === '.mjml'
			})
			.map(function (file) {
				// Do whatever you want to do with the file
				if (isInitial) console.log(file);
				return createComponent(file)
			});


		// create types.ts
		const typesPath = path.join(componentsPath, '/', 'types.ts')
		fs.writeFileSync(typesPath, `
		export interface mailResult {
			html: string;
			text: string
		}
		
		export type mailTemplateFunction = {
			(templateData: any): {
				html: string;
				text: string;
			};
			sourceName?: string;
		}
`)

		// create index.ts
		const indexPath = path.join(componentsPath, '/', 'index.ts')
		const indexContent = components.map(item => {
			return `export { ${item.component} } from "./${item.file}";`
		})
		indexContent.push('export type {mailTemplateFunction, mailResult} from "./types.ts";')
		fs.writeFileSync(indexPath, indexContent.join('\r\n'))

	});
}

build(true)
if (process.argv.indexOf('--watch') > 0) {
	chokidar.watch('./src', { ignoreInitial: true }).on('all', (event, path) => {
		console.log(event, path);
		build(false)
	});
}
