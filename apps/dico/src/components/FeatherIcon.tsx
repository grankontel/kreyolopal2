import * as feather from 'feather-icons'
import { DOMAttributes } from 'react'

export const FeatherIcon = ({
  iconName,
  className,
}: {
  iconName: string
  className?: string
}) => (
  <i
    className={className}
    dangerouslySetInnerHTML={{
      __html: feather.icons[iconName as feather.FeatherIconNames].toSvg({
        height: '1em',
        width: '1em',
      }),
    }}
  />
)

export default FeatherIcon
