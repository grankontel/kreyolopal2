import React from 'react'
import * as feather from 'feather-icons'

export const FeatherIcon = ({iconName}) => {
  return (
    <i
      dangerouslySetInnerHTML={{
        __html: feather.icons[iconName].toSvg({
          height: '1em',
          width: '1em',
        }),
      }}
    />
  )
}

export default FeatherIcon
