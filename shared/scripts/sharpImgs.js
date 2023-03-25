/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const sharp = require('sharp')

const sizes = [200, 320, 630, 800, 1024]

const basedir = path.resolve(__dirname, '../public/images')
const dest_prefix = 'w'
const formats = ['png', 'jpeg']

sizes.forEach((size) => {
  // create the destination directory
  const sizeDirName = dest_prefix + size
  const destDir = path.join(basedir, sizeDirName)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true }, (err) => {
      if (err) throw err
    })
  }

  formats.forEach((format) => {
    // build the glob pattern
    const gPattern = `${basedir}/*.${format}`
    const files = glob.sync(gPattern)

    // process the files
    files.forEach((file) => {
      const filename = path.basename(file)
      console.log(`\tProcessing : ${destDir}/${filename} ...`)
      const image = sharp(file)
      image
        .resize({ width: size })
        .toFile(`${destDir}/${filename.replace(format, 'webp')}`)
        .catch((err) => {
          console.log(err)
        })

      image
        .resize({ width: size })
        .toFile(`${destDir}/${filename}`)
        .catch((err) => {
          console.log(err)
        })
    })
  })
})
