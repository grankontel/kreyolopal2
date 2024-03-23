import * as feather from 'feather-icons'
import { DOMAttributes } from 'react'

type FeatherIconName = keyof typeof feather.icons

export const FeatherIcon = ({
  iconName,
  ...props
}: {
  iconName: FeatherIconName
  props: DOMAttributes<HTMLElement>
}) => {
  return (
    <i
      {...props}
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
