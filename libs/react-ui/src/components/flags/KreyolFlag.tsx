import * as React from "react"
import * as PropTypes from 'prop-types'

import { FlagGp } from './FlagGp'
import { FlagMq } from './FlagMq'
import { FlagHt } from './FlagHt'
import { FlagDm } from "./FlagDm"
import { KreyolLanguage } from "@kreyolopal/domain"

interface KreyolFlagProps extends React.SVGAttributes<SVGSVGElement> {
  kreyol: KreyolLanguage
}

export const KreyolFlag = (props: KreyolFlagProps) => {
  const { kreyol } = props

  switch (kreyol) {
    case 'gp':
      return <FlagGp {...props} />

    case 'mq':
      return <FlagMq {...props} />

    case 'ht':
      return <FlagHt {...props} />

      case 'dm':
        return <FlagDm {...props} />
  
      default:
      return <FlagGp {...props} />
  }
}

KreyolFlag.propTypes = {
  kreyol: PropTypes.string.isRequired,
}
