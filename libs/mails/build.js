//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname, './src');
const componentsPath = path.join(__dirname, './build');

/* fs.mkdir(componentsPath, function (err, files) {
	//handling error
	if (err) {
		if (err) throw err;
	}
})
 */
function createComponent(srcFile) {
	const sourceFilePath = path.join(directoryPath, '/', srcFile)
	const radix = srcFile.substr(0, srcFile.lastIndexOf("."))
	const componentName = radix[0].toUpperCase() + radix.slice(1);
	const dstFileName = componentName + ".tsx";
	const dstFilePath = path.join(componentsPath, '/', dstFileName)

	const content = fs.readFileSync(sourceFilePath,
		{ encoding: 'utf8', flag: 'r' });

	const dstContent = `export function ${componentName}() {
		return (${content})
	}
	`

	fs.writeFileSync(dstFilePath, dstContent)
}

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}
	//listing all files using forEach
	files
		.filter(file => {
			return path.extname(file).toLocaleLowerCase() === '.mjml'
		})
		.forEach(function (file) {
			// Do whatever you want to do with the file
			console.log(file);
			createComponent(file)
		});
});