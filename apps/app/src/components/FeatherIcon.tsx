import * as feather from 'feather-icons'

export const FeatherIcon = ({iconName, ...props}: {iconName:string}) => {
  return (
    <i {...props}
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
