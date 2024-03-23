import * as React from "react"
import * as PropTypes from 'prop-types'

import { FlagGp } from './FlagGp'
import { FlagMq } from './FlagMq'
import { FlagHt } from './FlagHt'
import { IconAttributes, KreyolLanguage } from "../../types"

export const KreyolFlag = ({kreyol, ...props}: {kreyol:KreyolLanguage, props: IconAttributes}) => {
  switch (kreyol) {
    case 'gp':
      return <FlagGp {...props} />

    case 'mq':
      return <FlagMq {...props} />

    case 'ht':
      return <FlagHt {...props} />

    default:
      return <FlagGp {...props} />
  }
}

KreyolFlag.propTypes = {
  kreyol: PropTypes.string.isRequired,
}
