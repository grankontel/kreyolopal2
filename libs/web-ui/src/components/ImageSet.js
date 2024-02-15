import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import path from 'path'

const sizes = [200, 320, 630, 800, 1024]

export const ImageSet = (props) => {
  const { src, alt, className, ...rest } = props

  const srcDir = path.dirname(src)
  const fileName = path.basename(src)
  const pictureClasses = classNames('image', className)

  const originalFormatSet = sizes
    .map((size) => {
      const sizeDir = `w${size}`
      const filePath = path.join(srcDir, sizeDir, fileName)
      return filePath + ' ' + size + 'w'
    })
    .join(', ')

  const webpSet = sizes
    .map((size) => {
      const sizeDir = `w${size}`
      const filePath = path.join(
        srcDir,
        sizeDir,
        fileName.replace(/\.[^.]+$/, '.webp')
      )
      return filePath + ' ' + size + 'w'
    })
    .join(', ')

  return (
    <picture className={pictureClasses} {...rest}>
      <source
        type="image/webp"
        sizes="(min-width: 800px) 800px, 100vw"
        srcSet={webpSet}
      />
      <img src={src} alt={alt} srcSet={originalFormatSet} />
    </picture>
  )
}

ImageSet.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default ImageSet
